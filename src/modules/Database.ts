import MapDB from "@galaxy05/map.db";

class Database {
    private db: MapDB;
    private filename: string;

    constructor(filename: string) {
        this.filename = filename;
    }

    init() {
        this.db = new MapDB(this.filename);
    }

    load(path: string, query?: any, multiple?: boolean) {
        let data = this.db.get(path);
        if (query) data = multiple ? data.filter(query) : data.find(query);

        return data;
    }

    async save(path: string, query: any, newData?: any): Promise<any|null> {
        let data = this.db.get(path);
        let idx = data.findIndex(query);

        if (idx == -1) return null;

        if (newData) {
            data[idx] = newData;
            await this.db.set(path, newData);
        }

        return this.db.get(path);
    }

    async delete(path: string, query: any) {
        let data = this.db.get(path);
        let idx;
        let deleted = [];

        do {
            idx = data.findIndex(query);
            if (idx != -1) {
                deleted.push(data[idx]);
                data.splice(idx, 1);
            }
        } while (idx != -1);

        if (deleted.length) await this.db.set(path, data);
        return deleted;
    }
}

export default Database;
