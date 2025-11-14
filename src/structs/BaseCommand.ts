import { ChatMessage } from "@twurple/chat";
import Gdreqbot from "../core";

class BaseCommand {
    config: Config;

    constructor({
        name = "",
        description = "Not specified",
        args = "",
        aliases = [] as string[],
        cooldown = 3,
        enabled = false,
        devOnly = false,
    }) {
        this.config = { name, description, args, aliases, cooldown, enabled, devOnly };
    }

    async run(client: Gdreqbot, msg: MsgData, args?: string[]) {}
}

interface Config {
    name: string;
    description?: string;
    args?: string;
    aliases?: string[];
    cooldown?: number;
    enabled?: boolean;
    devOnly?: boolean;
}

export interface MsgData {
    channel: string;
    user: string;
    text: string;
    msg: ChatMessage;
}

export default BaseCommand;
