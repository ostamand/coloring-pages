import { Router } from "@oak/oak";

import { getClientFromPool } from "../lib/db/mod.ts";
import { addNewMessage } from "../lib/db/messages.ts";

export const messagesRouter = new Router();

messagesRouter.post("/", async (ctx) => {
    const client = await getClientFromPool();
    try {
        const data = await ctx.request.body.json() as {
            name: string;
            message: string;
            email: string;
        };
        const { name, email, message } = data;
        if (!data || !name || !email || !message) {
            throw new Error("Missing data from request");
        }
        const id = await addNewMessage(client, name, email, message);

        ctx.response.body = { id };
    } catch (error) {
        console.error(error);
        ctx.response.status = 500;
        ctx.response.body = {};
    } finally {
        client.release();
    }
});

messagesRouter.prefix("/messages");
