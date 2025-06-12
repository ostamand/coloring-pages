import { Router } from "@oak/oak/router";

import { getCollectionByName } from "../lib/db/collection.ts";
import { getClientFromPool } from "../lib/db/db.ts";

export const collectionsRouter = new Router();

collectionsRouter.get("/:collectionName", async (ctx) => {
    const { collectionName } = ctx.params;
    if (!collectionName) {
        ctx.response.status = 400;
        ctx.response.body = {};
        return;
    }
    const client = await getClientFromPool();
    try {
        const collection = await getCollectionByName(client, collectionName);
        ctx.response.body = collection;
        if (!collection) {
            throw new Error(`No collection with name ${collectionName}`);
        }
    } catch (error) {
        console.error(error);
        ctx.response.status = 404;
        ctx.response.body = {};
    } finally {
        client.release();
    }
});

collectionsRouter.prefix("/collections");
