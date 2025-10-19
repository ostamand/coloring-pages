import { Client } from "@db/postgres";

import { getClientFromPool, setupDatabasePool } from "../lib/db/mod.ts";
import { loadAppConfigs } from "../lib/configs.ts";
import { Collection, Promotion } from "../lib/db/types.ts";

type PromoConfigs = {
    heading: string;
    sub_heading: string;
    background_url: string;
    collection_name: string;
    collection_display_name: string;
    active: boolean;
    showcase_page_id: number;
};

function parseArgs(args: string[]) {
    try {
        const inputPathIndex = args.indexOf("--in");
        if (inputPathIndex !== -1) {
            return {
                inputPath: args[inputPathIndex + 1],
            };
        }
    } catch (error) {
        console.error(error);
    }
    return {};
}

async function getOrCreateCollection(
    db: Client,
    promoConfigs: PromoConfigs,
): Promise<Collection | null> {
    // check if already exists

    try {
        const resultCollection = await db.queryObject(
            `SELECT * FROM collections WHERE name =$1`,
            [
                promoConfigs.collection_name,
            ],
        );
        if (resultCollection.rowCount === 1) {
            return resultCollection.rows[0] as Collection;
        }

        // need to create, does not exist

        const {
            collection_name,
            collection_display_name,
            heading,
            sub_heading,
            background_url,
        } = promoConfigs;

        const insertCollection = await db.queryObject(
            `INSERT INTO collections (name, display_name, heading, sub_heading, background_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                collection_name,
                collection_display_name,
                heading,
                sub_heading,
                background_url,
            ],
        );

        if (insertCollection.rowCount === 1) {
            console.log(
                `✅ Created new collection ${collection_display_name}`,
            );
            return insertCollection.rows[0] as Collection;
        }

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getPromotionByName(
    db: Client,
    collectionName: string,
): Promise<Promotion | null> {
    const resultPromotion = await db.queryObject(
        `SELECT * FROM promotions WHERE collection_name = $1`,
        [collectionName],
    );
    if (resultPromotion.rowCount === 1) {
        return resultPromotion.rows[0] as Promotion;
    }
    return null;
}

async function createPromotion(
    db: Client,
    promoConfigs: PromoConfigs,
): Promise<Promotion | null> {
    const {
        heading,
        sub_heading,
        background_url,
        showcase_page_id,
        collection_name,
        active,
    } = promoConfigs;

    try {
        const resultInsert = await db.queryObject(
            `INSERT INTO promotions (heading, sub_heading, background_url, showcase_page_id, collection_name, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                heading,
                sub_heading,
                background_url,
                showcase_page_id,
                collection_name,
                active,
            ],
        );
        if (resultInsert.rowCount === 1) {
            return resultInsert.rows[0] as Promotion;
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

async function updatePromotion(
    db: Client,
    promoConfigs: PromoConfigs,
): Promise<Promotion | null> {
    const {
        heading,
        sub_heading,
        background_url,
        showcase_page_id,
        collection_name,
        active,
    } = promoConfigs;

    try {
        const resultUpdate = await db.queryObject(
            `UPDATE promotions SET heading=$1, sub_heading=$2, background_url=$3, showcase_page_id=$4, collection_name=$5, active=$6 WHERE collection_name=$5 RETURNING *`,
            [
                heading,
                sub_heading,
                background_url,
                showcase_page_id,
                collection_name,
                active,
            ],
        );
        if (resultUpdate.rowCount === 1) {
            return resultUpdate.rows[0] as Promotion;
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

async function main(args: string[]) {
    const { inputPath } = parseArgs(args);
    if (!inputPath) {
        console.error("Promotion input configuration file is required (--in)");
        return;
    }
    const promoConfigs: PromoConfigs = JSON.parse(
        Deno.readTextFileSync(inputPath),
    );
    const appConfigs = loadAppConfigs();
    setupDatabasePool(appConfigs);
    const db = await getClientFromPool();

    try {
        const collection = await getOrCreateCollection(db, promoConfigs);

        if (!collection) {
            console.log(
                `❌ Failed creating collection with name ${promoConfigs.collection_name}`,
            );
            return;
        }

        // check to see if we need to update or insert
        let promotion = await getPromotionByName(db, promoConfigs.collection_name);

        if (!promotion) {
            // create new promotion
            promotion = await createPromotion(db, promoConfigs);
            if (promotion) {
                console.log(
                    `✅ Created new promotion ${promoConfigs.collection_display_name}`,
                );
                return;
            }
        } else {
            // update existing promotion
            promotion = await updatePromotion(db, promoConfigs);
            if (promotion) {
                console.log(
                    `✅ Updated promotion ${promoConfigs.collection_display_name}`,
                );
                return;
            }
        }
        console.log(
            `❌ Failed to create promotion ${promoConfigs.collection_display_name}`,
        );
    } finally {
        await db.release();
    }
}

// deno run --allow-all jobs/manage-promotion.ts --in jobs/promotions/a-pirate-life.json
if (import.meta.main) {
    await main(Deno.args);
}