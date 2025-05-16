import { Router } from "@oak/oak";
import { getClientFromPool } from "../lib/db/db.ts";

import { addDownloadLog, DownloadLog } from "../lib/db/download-log.ts";

export const logsRouter = new Router();

function anonymizeIp(ip: string) {
    return ip.replace(/\.\d+$/, ".xxx");
}

logsRouter.post("/download", async (ctx) => {
    const client = await getClientFromPool();
    try {
        const data = await ctx.request.body.json() as {
            pageId: number;
            url: string;
        };
        if (!data) {
            throw new Error("Missing data from request");
        }

        const downloadLog: DownloadLog = {
            ...data,
            userAgent: ctx.request.headers.get("user-agent"),
            referrer: ctx.request.headers.get("referer") || "Direct",
            ip: anonymizeIp(ctx.request.ip),
        };

        const id = await addDownloadLog(client, downloadLog);

        ctx.response.headers.set("Access-Control-Allow-Origin", "*");
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
