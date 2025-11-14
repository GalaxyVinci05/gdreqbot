import MapDB from "@galaxy05/map.db";
import Gdreqbot from "../core";
import superagent from "superagent";

class Request {
    //query: string;
    //type?: "id" | "name";

    //constructor(query: string, type: "id" | "name" = "id") {
    //    this.query = query;
    //    this.type = type;
    //}
    private enabled: boolean;

    constructor(db: MapDB) {
        this.enabled = true;

        let data: LevelData[] = db.get("levels");
        if (!data?.length) {
            db.set("levels", []);
        }
    }

    private parseLevel(raw: string, user: string): LevelData {
        return {
            name: raw.split(":")[3],
            creator: raw.split("#")[1].split(":")[1],
            id: raw.split(":")[1],
            user
        };
    }

    async addLevel(client: Gdreqbot, query: string, user: string) {
        if (!this.enabled) return { status: ResCode.DISABLED };

        try {
            let res = await superagent
                .post("http://www.boomlings.com/database/getGJLevels21.php")
                .set("Content-Type", "application/x-www-form-urlencoded")
                .set("User-Agent", "")
                .send({
                    "str": query,
                    "type": 0,
                    "secret": "Wmfd2893gb7",
                });
            console.log(res.text);
            if (res.text == "-1") return { status: ResCode.NOT_FOUND };

            let level = this.parseLevel(res.text, user);
            let data: LevelData[] = client.db.get("levels");

            if (data.find(l => l.id == level.id)) return { status: ResCode.ALREADY_ADDED };
            else if (data.filter(l => l.user == user).length >= 2) return { status: ResCode.MAX_PER_USER };

            data.push(level);
            await client.db.set("levels", data);

            return { status: ResCode.OK, level };
        } catch (e) {
            console.error(e);
            return { status: ResCode.ERROR };
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

export default Request;

export interface LevelData {
    name: string;
    creator: string;
    id: string;
    user: string;
}

export enum ResCode {
    OK,
    NOT_FOUND,
    MAX_PER_USER,
    ALREADY_ADDED,
    DISABLED,
    ERROR
}
