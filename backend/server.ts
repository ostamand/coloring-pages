import { Application } from "jsr:@oak/oak";

import { pagesRouter } from "./routes/pages.ts";
import { proxyRouter } from "./routes/proxy.ts";
import { setupDatabasePool } from "./lib/db/db.ts";
import { loadAppConfigs } from "./lib/configs.ts";

const port = Number(Deno.args[0]);
if (!port) {
    throw new Error("Missing port arg.");
}

const configs = loadAppConfigs();
setupDatabasePool(configs);

const app = new Application();

app.use(pagesRouter.routes());
app.use(pagesRouter.allowedMethods());

app.use(proxyRouter.routes());
app.use(proxyRouter.allowedMethods());

console.log(`Server running on http://localhost:${port}`);
await app.listen({ port });
