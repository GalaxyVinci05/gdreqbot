import Gdreqbot from "../core";
import BaseCommand from "../structs/BaseCommand";
import { ChatMessage } from "@twurple/chat";
import PermLevels from "../structs/PermLevels";
import { Blacklist } from "../datasets/blacklist";
import * as twitch from "../apis/twitch";
import { User } from "../structs/user";

export = class BlacklistCommand extends BaseCommand {
    constructor() {
        super({
            name: "blacklist",
            description: "Manage blacklisted users (prevented from using the bot)",
            args: "add|remove|list|clear [<user>]",
            aliases: ["bl"],
            enabled: true,
            permLevel: PermLevels.MOD
        });
    }

    async run(client: Gdreqbot, msg: ChatMessage, channel: string, args: string[]): Promise<any> {
        let blacklist: Blacklist = client.db.load("blacklist", { channelId: msg.channelId });

        if (!args.length || (!["add", "remove", "clear", "list"].includes(args[0]))) return client.say(channel, "You must select a valid action (add|remove|list|clear)", { replyTo: msg });
        if (!args[1] && (!["clear", "list"].includes(args[0]))) return client.say(channel, "You must specify a user.", { replyTo: msg });

        switch (args[0]) {
            case "add": {
                let userName = args[1].replace(/\s*@\s*/g, '').toLowerCase();
                let rawUser = await twitch.getUser(userName, "login");

                if (!rawUser) return client.say(channel, "An error occurred fetching user data. Please try again.", { replyTo: msg });
                else if (!rawUser.data.length) return client.say(channel, "That user doesn't exist.", { replyTo: msg });

                let user: User = {
                    userId: rawUser.data[0].id,
                    userName: rawUser.data[0].login
                };

                if (blacklist.users.some(u => u.userId == user.userId)) return client.say(channel, "That user is already blacklisted.", { replyTo: msg });

                blacklist.users.push(user);
                await client.db.save("blacklist", { channelId: msg.channelId }, { users: blacklist.users });

                client.say(channel, `Added ${userName} to the blacklist.`, { replyTo: msg });
                break;
            }

            case "remove": {
                let userName = args[1].replace(/\s*@\s*/g, '').toLowerCase();
                let rawUser = await twitch.getUser(userName, "login");

                if (!rawUser) return client.say(channel, "An error occurred fetching user data. Please try again.", { replyTo: msg });
                else if (!rawUser.data.length) return client.say(channel, "That user doesn't exist.", { replyTo: msg });

                let idx = blacklist.users.findIndex(u => u.userId == rawUser.data[0].id);
                if (idx == -1) return client.say(channel, "That user isn't blacklisted.", { replyTo: msg });

                blacklist.users.splice(idx, 1);
                await client.db.save("blacklist", { channelId: msg.channelId }, { users: blacklist.users });

                client.say(channel, `Removed ${userName} from the blacklist.`, { replyTo: msg });
                break;
            }

            case "clear": {
                await client.db.save("blacklist", { channelId: msg.channelId }, { users: [] });

                client.say(channel, "Cleared the blacklist.", { replyTo: msg });
                break;
            }

            case "list": {
                let page = parseInt(args[1]);
                if (args[1] && isNaN(page))
                    return client.say(channel, "Kappa Sir that's not a number.", { replyTo: msg });

                if (!blacklist.users.length) return client.say(channel, "The blacklist is empty.", { replyTo: msg });

                let pages = [];
                let done = false;
                let start = 0;
                let end = blacklist.users.length >= 10 ? 10 : blacklist.users.length;
                let pos = 0;

                while (!done) {
                    let list = blacklist.users.slice(start, end);
                    if (!list.length) {
                        done = true;
                        break;
                    }

                    pages.push(list.map(l => {
                        pos++;
                        return l.userName;
                    }));

                    start += 10;
                    end += blacklist.users.length > start ? 10 : 0;

                    if (start > end) done = true;
                }

                if (page > pages.length)
                    return client.say(channel, "Kappa There aren't that many pages.", { replyTo: msg });

                client.say(channel, `Page ${page || "1"} of ${pages.length} (${blacklist.users.length} users) | ${pages[page ? page-1 : 0].join(", ")}`, { replyTo: msg });
                break;
            }
        }
    }
}
