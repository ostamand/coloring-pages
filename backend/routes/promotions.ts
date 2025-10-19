import { Router } from "jsr:@oak/oak";

import { getClientFromPool } from "../lib/db/mod.ts";
import { getActivePromotions } from "../lib/db/promotions.ts";

export const promotionsRouter = new Router();

promotionsRouter.get("/", async (ctx) => {
    const client = await getClientFromPool();
    try {
        const activePromotions = await getActivePromotions(client);
        ctx.response.body = activePromotions;
    } catch (error) {
        console.error(error);
        ctx.response.status = 500;
        ctx.response.body = [];
    } finally {
        client.release();
    }
});

promotionsRouter.prefix("/promotions");
