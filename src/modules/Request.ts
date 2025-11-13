import Gdreqbot from "../core";
import superagent from "superagent";

class Request {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    async fetch() {
        try {
            let data = {
                "str": "bloodbath",
                "star": 1,
                "type": 0,
                "secret": "Wmfd2893gb7",
            };
            let res = await superagent
                .post("http://www.boomlings.com/database/getGJLevels21.php")
                .set("Content-Type", "application/x-www-form-urlencoded")
                .set("User-Agent", "")
                .send(data);
            console.log(res.text);
        } catch (e) {
            console.error(e);
        }
    }
}

export default Request;
