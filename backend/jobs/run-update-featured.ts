import { getClientFromPool, setupDatabasePool } from "../lib/db/mod.ts";
import { loadAppConfigs } from "../lib/configs.ts";

const WEB_URL = "https://coloritdaily.com";

async function main() {
    const configs = loadAppConfigs();
    setupDatabasePool(configs);
    const db = await getClientFromPool();

    try {
        await db.queryObject("BEGIN");
        /*
        Get random pages to feature
        Can only feature pages from Thick Lines collection for now.
        */
        const resultRandom = await db.queryArray(`
        SELECT id
        FROM pages
        WHERE featured_on IS NULL 
            AND published=false
            AND collection_name IN ('Thick Lines', 'Halloween')
        ORDER BY RANDOM()
        LIMIT 1;`);
        if (!resultRandom?.rowCount || resultRandom?.rowCount < 1) {
            console.log("Nothing to feature.");
            return;
        }
        const page_id = resultRandom.rows[0][0] as number;

        // delete previous featured
        await db.queryArray("DELETE FROM featured");

        // insert new featured
        await db.queryArray(
            "INSERT INTO featured (page_id) VALUES ($1)",
            [
                page_id,
            ],
        );

        // update featured_on previous featured
        await db.queryArray(
            `UPDATE pages SET featured_on=$1, published=true WHERE id = $2`,
            [new Date().toISOString(), page_id],
        );
        await db.queryObject("COMMIT");
        console.log(`✅ New page featured`);
    } catch (_) {
        await db.queryObject("ROLLBACK");
        console.error(`❌ Page was not featured.`);
        return;
    } finally {
        await db.release();
    }

    // new featured page, let's invalidate web cache

    const response = await fetch(`${WEB_URL}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: configs.revalidateSecret }),
    });

    if (!response.ok) {
        console.error(`❌ Failed to invalidate cache.`);
        return;
    }

    console.log(`✅ Web cache invalidated`);
}

if (import.meta.main) {
    main();
}