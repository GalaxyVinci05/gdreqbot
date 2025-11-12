import { RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient, ChatClientOptions } from "@twurple/chat";
import fs from "fs";
import { config } from "dotenv";
config({ quiet: true });

import BaseCommand from "./structs/BaseCommand";
import CommandLoader from "./modules/CommandLoader";
import Logger from "./modules/Logger";

const usrId = "1391218436";
const prefix = process.env.PREFIX;
const clientId = process.env.CLIENT_ID as string;
const clientSecret = process.env.SECRET as string;

const tokenData = JSON.parse(fs.readFileSync(`./tokens.${usrId}.json`, "utf-8"));
const authProvider = new RefreshingAuthProvider({
    clientId,
    clientSecret
});

authProvider.addUser(usrId, tokenData);
authProvider.addIntentsToUser(usrId, ["chat"]);

authProvider.onRefresh((userId, newTokenData) => {
    fs.writeFileSync(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), "utf-8");
    new Logger().log("Refreshing token...");
});

class Gdreqbot extends ChatClient {
    commands: Map<string, BaseCommand>;
    cmdLoader: CommandLoader;
    logger: Logger;

    constructor(options: ChatClientOptions) {
        super(options);

        this.commands = new Map();
        this.cmdLoader = new CommandLoader();
        this.logger = new Logger();
    }
}

const client = new Gdreqbot({
    authProvider,
    channels: ["galaxyvinci05"],
});

const cmdFiles = fs.readdirSync("./dist/commands/").filter(f => f.endsWith(".js"));

for (const file of cmdFiles) {
    const res = client.cmdLoader.load(client, file);
    if (res) client.logger.error(res);

    delete require.cache[require.resolve(`./commands/${file}`)];
}

client.connect();
client.onMessage(async (channel, user, text, msg) => {
    if (!text.startsWith(prefix)) return;
    let cmd = client.commands.get(text.slice(1));

    if (!cmd) return;

    try {
        await cmd.run(client, { channel, user, text, msg });
    } catch (e) {
        console.log(e);
    }
});

export default Gdreqbot;
