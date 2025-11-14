import Gdreqbot from "../core";
import BaseCommand, { MsgData } from "../structs/BaseCommand";
import { ResCode } from "../modules/Request";

export = class PingCommand extends BaseCommand {
    constructor() {
        super({
            name: "req",
            description: "Request a level by ID",
            args: "<levelID>",
            aliases: ["r", "request"],
            enabled: true
        });
    }

    async run(client: Gdreqbot, msg: MsgData, args: string[]): Promise<any> {
        let { channel } = msg;
        let res = await client.req.addLevel(client, args[0], msg.user);

        switch (res.status) {
            case ResCode.NOT_FOUND: {
                client.say(channel, "Kappa Couldn't find a level matching that ID.");
                break;
            }

            case ResCode.ALREADY_ADDED: {
                client.say(channel, "Kappa That level is already in the queue.");
                break;
            }

            case ResCode.MAX_PER_USER: {
                client.say(channel, "Kappa You have the max amount of levels in the queue (2)");
                break;
            }

            case ResCode.DISABLED: {
                client.say(channel, "Kappa Requests are disabled.");
                break;
            }

            case ResCode.ERROR: {
                client.say(channel, "An error occurred.");
                break;
            }

            case ResCode.OK: {
                client.say(channel, `PogChamp Added '${res.level.name}' by ${res.level.creator} to the queue at position ${client.db.get("levels").length}`);
                break;
            }
        }
    }
}
