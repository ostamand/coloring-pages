import { Router } from "jsr:@oak/oak";

import { getClientFromPool } from "../lib/db/db.ts";
import {
    getCurrentCounts,
    getPages,
    getPagesById,
    searchPages,
} from "../lib/db/mod.ts";

export const pagesRouter = new Router();

pagesRouter.get("/count", async (ctx) => {
    const client = await getClientFromPool();
    try {
        const results = await getCurrentCounts(client);
        ctx.response.body = results;
    } catch (error) {
        console.error(error);
        ctx.response.status = 500;
        ctx.response.body = [];
    } finally {
        client.release();
    }
});

pagesRouter.get("/:id", async (ctx) => {
    const client = await getClientFromPool();
    try {
        const results = await getPagesById(client, [Number(ctx.params.id)]);
        if (results.length === 1) {
            ctx.response.body = results[0] || {};
        } else {
            throw Error(`Page with id ${ctx.params.id} does not exists.`);
        }
    } catch (error) {
        console.error(error);
        ctx.response.status = 404;
        ctx.response.body = {};
    } finally {
        client.release();
    }
});

pagesRouter.get("/", async (ctx) => {
    const client = await getClientFromPool();
    const { searchParams } = ctx.request.url;

    const limit = Number(searchParams.get("limit")) || 10;
    const searchQuery = searchParams.get("search");

    let random = false;
    const randomParam = searchParams.get("random");
    if (randomParam && randomParam === "true") {
        random = true;
    }

    try {
        let results: any = {};
        if (searchQuery) {
            results = await searchPages(client, searchQuery, limit);
        } else {
            results = await getPages(client, limit, random);
        }
        ctx.response.body = results;
    } catch (error) {
        console.error(error);
        ctx.response.status = 500;
        ctx.response.body = [];
    } finally {
        client.release();
    }
});

pagesRouter.prefix("/pages");
