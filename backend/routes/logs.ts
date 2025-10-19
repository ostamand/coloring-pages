import { Request, Router } from "@oak/oak";
import { getClientFromPool } from "../lib/db/mod.ts";

import { addDownloadLog, DownloadLog } from "../lib/db/download-log.ts";
import { addPageRequest, PageRequest } from "../lib/db/page.ts";

export const logsRouter = new Router();

function anonymizeIp(ip: string) {
    return ip.replace(/\.\d+$/, ".xxx");
}

function getUserData(request: Request) {
    return {
        userAgent: request.headers.get("user-agent"),
        referrer: request.headers.get("referer") || "Direct",
        ip: anonymizeIp(request.ip),
    };
}

logsRouter.post("/downloads", async (ctx) => {
    const client = await getClientFromPool();
    try {
        const data = await ctx.request.body.json() as DownloadLog;
        if (!data) {
            throw new Error("Missing data from request");
        }
        const id = await addDownloadLog(client, data);
        ctx.response.body = { id };
    } catch (error) {
        console.error(error);
        ctx.response.status = 400;
        ctx.response.body = {};
    } finally {
        client.release();
    }
});

logsRouter.post("/request", async (ctx) => {
    const client = await getClientFromPool();
    try {
        const data = await ctx.request.body.json() as {
            request: string;
        };
        if (!data) {
            throw new Error("Missing data from request");
        }

        const pageRequest: PageRequest = {
            ...data,
            ...getUserData(ctx.request),
        };

        const id = await addPageRequest(client, pageRequest);

        ctx.response.body = { id };
    } catch (error) {
        console.error(error);
        ctx.response.status = 400;
        ctx.response.body = {};
    } finally {
        client.release();
    }
});

logsRouter.prefix("/logs");
