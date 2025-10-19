import { getClientFromPool, setupDatabasePool } from "../lib/db/mod.ts";
import { loadAppConfigs } from "../lib/configs.ts";

async function main(args: string[]) {
    const indexId = args.indexOf("--id");

    if (indexId === -1) {
        console.error("page id is required (--id)");
    }

    const id = Number(Deno.args[indexId + 1]);

    const configs = loadAppConfigs();
    setupDatabasePool(configs);
    const db = await getClientFromPool();

    try {
        const result = await db.queryArray(
            `UPDATE pages SET published=true WHERE id=${id} RETURNING id;`,
        );

        if (result.rowCount !== 1) {
            console.error(`❌ Failed to publish page with id ${id}`);
        }

        console.log(`✅ Published page with id ${id}`);
    } finally {
        await db.release();
    }
}

if (import.meta.main) {
    await main(Deno.args);
}