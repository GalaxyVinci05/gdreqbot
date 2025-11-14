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

        let levels: LevelData[] = db.get("levels");
        if (!levels?.length) {
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

            let newLvl = this.parseLevel(res.text, user);
            let levels: LevelData[] = client.db.get("levels");

            if (levels.find(l => l.id == newLvl.id)) return { status: ResCode.ALREADY_ADDED };
            else if (levels.filter(l => l.user == user).length >= 2) return { status: ResCode.MAX_PER_USER };

            levels.push(newLvl);
            await client.db.set("levels", levels);

            return { status: ResCode.OK, level: newLvl };
        } catch (e) {
            console.error(e);
            return { status: ResCode.ERROR };
        }
    }

    async removeLevel(client: Gdreqbot, id: string) {
        let levels: LevelData[] = client.db.get("levels");
        if (!levels.length) return { status: ResCode.EMPTY };

        let idx = levels.findIndex(l => l.id == id);
        let level = levels.splice(idx, 1);

        try {
            await client.db.set("levels", levels);
        } catch (e) {
            console.error(e);
            return { status: ResCode.ERROR };
        }

        return { status: ResCode.OK, level };
    }

    async next(client: Gdreqbot) {
        let levels: LevelData[] = client.db.get("levels");
        if (!levels.length)
            return { status: ResCode.EMPTY };

        try {
            levels.shift();
            await client.db.set("levels", levels);
        } catch (e) {
            console.error(e);
            return { status: ResCode.ERROR };
        }

        let level: LevelData = client.db.get("levels")[0];
        if (!level)
            return { status: ResCode.EMPTY };

        return { status: ResCode.OK, level };
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
    EMPTY,
    ERROR
}
