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
