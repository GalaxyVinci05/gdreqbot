import Gdreqbot from "../core";
import BaseCommand, { MsgData } from "../structs/BaseCommand";
import { LevelData, ResCode } from "../modules/Request";

export = class PingCommand extends BaseCommand {
    constructor() {
        super({
            name: "remove",
            description: "Remove your last level from the queue",
            aliases: ["rm", "oops"],
            enabled: true
        });
    }

    async run(client: Gdreqbot, msg: MsgData, args: string[]): Promise<any> {
        let { channel } = msg;
        let levels: LevelData[] = client.db.get("levels");
        let id = "";
        if (msg.user == "galaxyvinci05" && args[0]) {
            id = args[0];
        } else {
            let usrLvls = levels.filter(l => l.user == msg.user);
            id = usrLvls[usrLvls.length - 1].id;
        }

        let res = await client.req.removeLevel(client, id);

        switch (res.status) {
            case ResCode.EMPTY: {
                client.say(channel, "Kappa The queue is empty.");
                break;
            }

            case ResCode.ERROR: {
                client.say(channel, "An error occurred.");
                break;
            }

            case ResCode.OK: {
                client.say(channel, `PogChamp Removed '${res.level[0].name}' by ${res.level[0].creator} from the queue.`);
                break;
            }
        }
    }
}
