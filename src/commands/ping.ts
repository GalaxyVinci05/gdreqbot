import Gdreqbot from "../core";
import { ChatMessage } from "@twurple/chat";
import BaseCommand, { MsgData } from "../structs/BaseCommand";

export = class PingCommand extends BaseCommand {
    constructor() {
        super({
            name: "ping",
            description: "Gives the bot latency",
            enabled: true
        });
    }

    async run(client: Gdreqbot, data: MsgData): Promise<any> {
        await client.say(data.channel, "pong");
    }
}
