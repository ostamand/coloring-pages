import { Client, Pool } from "jsr:@db/postgres";

import { AppConfigs } from "../types.ts";

let pool: Pool | null = null;

export function getDatabaseClient(configs: AppConfigs) {
    return new Client({
        database: configs.db.name,
        port: configs.db.port,
        user: configs.db.user,
        password: configs.db.password,
        hostname: configs.db.hostname,
    });
}

export function setupDatabasePool(configs: AppConfigs) {
    pool = new Pool({
        database: configs.db.name,
        port: configs.db.port,
        user: configs.db.user,
        password: configs.db.password,
        hostname: configs.db.hostname,
    }, configs.db.poolSize);
}

export async function getClientFromPool() {
    if (!pool) {
        throw new Error("Need to call 'setupDatabasePool' first");
    }
    return await pool.connect();
}
