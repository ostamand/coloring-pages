import { Client, Pool } from "jsr:@db/postgres";

import { AppConfigs } from "../types.ts";
import { config } from "node:process";

let pool: Pool | null = null;

function getConnectionString(configs: AppConfigs) {
    // 'postgres://your_user:your_password@localhost:5432/your_database?sslmode=disable'
    return `postgres://${configs.db.user}:${configs.db.password}@${configs.db.hostname}:${configs.db.port}/${configs.db.name}?sslmode=disable`;
}

export function getDatabaseClient(configs: AppConfigs) {
    return new Client(getConnectionString(configs));
}

export function setupDatabasePool(configs: AppConfigs) {
    pool = new Pool(getConnectionString(configs), configs.db.poolSize);
}

export async function getClientFromPool() {
    if (!pool) {
        throw new Error("Need to call 'setupDatabasePool' first");
    }
    return await pool.connect();
}
