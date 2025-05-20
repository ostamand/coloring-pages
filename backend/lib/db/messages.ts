import { Client } from "jsr:@db/postgres";

export async function addNewMessage(
    db: Client,
    name: string,
    email: string,
    message: string,
) {
    const result = await db.queryArray(
        "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING id",
        [name, email, message],
    );
    return result.rows[0][0] as number;
}
