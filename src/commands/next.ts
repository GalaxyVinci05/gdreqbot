import Gdreqbot from "../core";
import { LevelData } from "../modules/Request";
import BaseCommand, { MsgData } from "../structs/BaseCommand";

export = class PingCommand extends BaseCommand {
    constructor() {
        super({
            name: "next",
            description: "Shifts the queue",
            aliases: ["n"],
            enabled: true,
            devOnly: true
        });
    }

    async run(client: Gdreqbot, msg: MsgData): Promise<any> {
        let data: LevelData[] = client.db.get("levels");
        if (!data.length) return client.say(msg.channel, "Kappa The queue is empty.");

        data.shift();
        await client.db.set("levels", data);

        let level: LevelData = client.db.get("levels")[0];
        if (!level) return client.say(msg.channel, "Kappa The queue is empty.")
        client.say(msg.channel, `PogChamp Next level: '${level.name}' (${level.id}) by ${level.creator}`);
    }
}
