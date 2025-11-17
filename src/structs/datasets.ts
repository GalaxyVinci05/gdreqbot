import PermLevels from "./PermLevels";

export interface ChannelData {
    channelId: string;
    channelName: string;
    levels: LevelData[];
    settings: Settings;
    perms: Perm[];
    blacklist: User[];
}

export interface Levels {
    channelId: string;
    channelName: string;
    levels: LevelData[];
}

export interface LevelData {
    name: string;
    creator: string;
    id: string;
    user: User;
}

export interface Settings {
    req_enabled?: boolean;
    max_per_user?: number;
    max_queue?: number;
}

export interface Perm {
    cmd: string;
    perm: PermLevels;
}

export interface User {
    userId: string;
    userName: string;
}
