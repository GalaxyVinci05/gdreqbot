import Gdreqbot from "../core";
import superagent from "superagent";

class Request {
    //query: string;
    //type?: "id" | "name";

    //constructor(query: string, type: "id" | "name" = "id") {
    //    this.query = query;
    //    this.type = type;
    //}

    async fetch(query: string, type: "id" | "name" = "id") {
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

            return res.text;
        } catch (e) {
            console.error(e);
        }
    }
}

export default Request;
