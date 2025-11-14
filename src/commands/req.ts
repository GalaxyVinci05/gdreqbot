import Gdreqbot from "../core";
import BaseCommand, { MsgData } from "../structs/BaseCommand";
import { ResCode, Settings } from "../modules/Request";

export = class ReqCommand extends BaseCommand {
    constructor() {
        super({
            name: "req",
            description: "Request a level by name or ID",
            args: "<query>",
            aliases: ["r", "request"],
            enabled: true
        });
    }

    async run(client: Gdreqbot, msg: MsgData, args: string[]): Promise<any> {
        let { channel } = msg;
        let res = await client.req.addLevel(client, args.join(" "), msg.user);
        let sets: Settings = client.db.get("settings");

        switch (res.status) {
            case ResCode.NOT_FOUND: {
                client.say(channel, "Kappa Couldn't find a level matching that query (is it unlisted?)");
                break;
            }

            case ResCode.ALREADY_ADDED: {
                client.say(channel, "Kappa That level is already in the queue.");
                break;
            }

            case ResCode.MAX_PER_USER: {
                client.say(channel, `Kappa You have the max amount of levels in the queue (${sets.max_per_user})`);
                break;
            }

            case ResCode.FULL: {
                client.say(channel, `Kappa The queue is full (max ${sets.max_queue} levels)`);
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
                client.say(channel, `PogChamp Added '${res.level.name}' (${res.level.id}) by ${res.level.creator} to the queue at position ${client.db.get("levels").length}`);
                break;
            }
        }
    }
}
