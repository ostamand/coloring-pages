import { Application } from "jsr:@oak/oak";

import { pagesRouter } from "./routes/pages.ts";
import { proxyRouter } from "./routes/proxy.ts";
import { logsRouter } from "./routes/logs.ts";
import { messagesRouter } from "./routes/messages.ts";
import { promotionsRouter } from "./routes/promotions.ts";
import { collectionsRouter } from "./routes/collections.ts";

import { setupDatabasePool } from "./lib/db/db.ts";
import { loadAppConfigs } from "./lib/configs.ts";

const port = Number(Deno.args[0]);
if (!port) {
    throw new Error("Missing port arg.");
}

const configs = loadAppConfigs();
setupDatabasePool(configs);

const app = new Application();

app.use(async (ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST",
    );
    ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    //preflight
    if (ctx.request.method === "OPTIONS") {
        ctx.response.status = 204;
        return;
    }
    await next();
});

app.use(pagesRouter.routes());
app.use(pagesRouter.allowedMethods());

app.use(proxyRouter.routes());
app.use(proxyRouter.allowedMethods());

app.use(logsRouter.routes());
app.use(logsRouter.allowedMethods());

app.use(messagesRouter.routes());
app.use(messagesRouter.allowedMethods());

app.use(promotionsRouter.routes());
app.use(promotionsRouter.allowedMethods());

app.use(collectionsRouter.routes());
app.use(collectionsRouter.allowedMethods());

console.log(`Server running on http://localhost:${port}`);
await app.listen({ port });
