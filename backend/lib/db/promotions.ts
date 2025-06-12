import { Client } from "jsr:@db/postgres";

export async function getActivePromotions(db: Client) {
    const resultPromotions = await db.queryObject(`
        SELECT promotions.*, to_jsonb(pages) AS page
        FROM promotions
        JOIN pages ON promotions.showcase_page_id = pages.id
        WHERE promotions.active = true`);
    return resultPromotions.rows;
}
