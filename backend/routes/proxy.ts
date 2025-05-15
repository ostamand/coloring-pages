import { Router } from "jsr:@oak/oak";

export const proxyRouter = new Router();

proxyRouter.get("/proxy", async (ctx) => {
    const targetUrl = ctx.request.url.searchParams.get("url");
    if (!targetUrl) {
        ctx.response.status = 400;
        return;
    }
    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            ctx.response.status = response.status;
            return;
        }
        ctx.response.body = response.body;
        ctx.response.status = 200;

        const contentType = response.headers.get("Content-Type");
        if (contentType) {
            ctx.response.headers.set("Content-Type", contentType);
        }

        ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    } catch (error) {
        console.error("Error fetching the file:", error);
        ctx.response.status = 500;
    }
});
