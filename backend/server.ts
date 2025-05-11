import { Application } from "jsr:@oak/oak";

import { pagesRouter } from "./routes/pages.ts";
import { setupDatabasePool } from "./lib/db/db.ts";
import { loadAppConfigs } from "./lib/configs.ts";

const configs = loadAppConfigs();
setupDatabasePool(configs);

const app = new Application();

app.use(pagesRouter.routes());
app.use(pagesRouter.allowedMethods());

console.log("Server running on http://localhost:3000");
await app.listen({ port: 3000 });
