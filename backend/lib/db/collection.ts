import { Client } from "@db/postgres";
import { Collection } from "./types.ts";

export async function getCollectionByName(db: Client, collectionName: string) {
    try {
        const result = await db.queryObject(
            `SELECT * FROM collections WHERE name=$1 LIMIT 1`,
            [collectionName],
        );
        if (result.rowCount === 1) {
            return result.rows[0] as Collection;
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}
