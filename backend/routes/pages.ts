import { Router } from "jsr:@oak/oak";

import { getClientFromPool } from "../lib/db/db.ts";
import { getPages, getPagesById } from "../lib/db/mod.ts";

export const pagesRouter = new Router();

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
    try {
        const results = await getPages(client, limit);
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
