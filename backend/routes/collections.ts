import { Router } from "@oak/oak/router";

import { getCollectionByName, getCollections } from "../lib/db/collection.ts";
import { getClientFromPool } from "../lib/db/mod.ts";

export const collectionsRouter = new Router();

collectionsRouter.get("/", async (ctx) => {
    const client = await getClientFromPool();
    try {
        const collections = await getCollections(client);
        ctx.response.body = collections;
    } catch (error) {
        console.error(error);
        ctx.response.status = 404;
        ctx.response.body = [];
    } finally {
        client.release();
    }
});

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
        if (!collection) {
            throw new Error(`No collection with name ${collectionName}`);
        }
        ctx.response.body = collection;
    } catch (error) {
        console.error(error);
        ctx.response.status = 404;
        ctx.response.body = {};
    } finally {
        client.release();
    }
});

collectionsRouter.prefix("/collections");
