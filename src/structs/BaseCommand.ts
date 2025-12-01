import { ChatMessage } from "@twurple/chat";
import Gdreqbot from "../core";
import PermLevels from "./PermLevels";

class BaseCommand {
    config: Config;

    constructor({
        name = "",
        description = "Not specified",
        category = "others",
        privilegeDesc = "Not specified",
        args = "",
        privilegeArgs = "",
        aliases = [] as string[],
        cooldown = 3,
        enabled = false,
        permLevel = PermLevels.USER,
        supportsPrivilege = false
    }) {
        this.config = { name, description, category, privilegeDesc, args, privilegeArgs, aliases, cooldown, enabled, permLevel, supportsPrivilege };
    }

    async run(client: Gdreqbot, msg: ChatMessage, channel: string, args?: string[], userPerms?: PermLevels, privilegeMode?: boolean) {}
}

interface Config {
    name: string;
    description?: string;
    category?: string;
    privilegeDesc?: string;
    args?: string;
    privilegeArgs?: string;
    aliases?: string[];
    cooldown?: number;
    enabled?: boolean;
    permLevel?: PermLevels;
    supportsPrivilege?: boolean;
}

export default BaseCommand;
