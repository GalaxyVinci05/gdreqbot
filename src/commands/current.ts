import Gdreqbot from "../core";
import { LevelData, ResCode } from "../modules/Request";
import BaseCommand, { MsgData } from "../structs/BaseCommand";

export = class CurrentCommand extends BaseCommand {
    constructor() {
        super({
            name: "current",
            description: "Gets the current level",
            aliases: ["c"],
            enabled: true
        });
    }

    async run(client: Gdreqbot, msg: MsgData): Promise<any> {
        let { channel } = msg;
        let levels: LevelData[] = client.db.get("levels");
        if (!levels.length)
            return client.say(channel, "Kappa The queue is empty.");

        client.say(channel, `Current level: '${levels[0].name}' (${levels[0].id}) by ${levels[0].creator}`);
    }
}
