import "@std/dotenv/load";

import { AppConfigs } from "./types.ts";

let appConfigs: AppConfigs | null = null;

export function loadAppConfigs(): AppConfigs {
    if (!appConfigs) {
        appConfigs = {
            db: {
                name: Deno.env.get("DB_NAME") || "",
                port: Number(Deno.env.get("DB_PORT")) || 0,
                user: Deno.env.get("DB_USER") || "",
                password: Deno.env.get("DB_PASSWORD") || "",
                hostname: Deno.env.get("DB_HOSTNMAME") || "",
                poolSize: Number(Deno.env.get("DB_POOL_SIZE")) || 5,
            },
            s3: {
                region: Deno.env.get("S3_REGION") || "",
                accessKeyId: Deno.env.get("S3_ACCESS_KEY_ID") || "",
                secretAccessKey: Deno.env.get("S3_SECRET_ACCESS_KEY") || "",
                bucket: Deno.env.get("S3_BUCKET") || "",
            },
            cloudfrontUrl: Deno.env.get("CLOUDFRONT_URL") || "",
            geminiApiKey: Deno.env.get("GEMINI_API_KEY") || "",
            comfyServerAddress: Deno.env.get("COMFY_ADDRESS") || "",
            comfyApiEndpoint: `http://${Deno.env.get("COMFY_ADDRESS") || ""}`,
            comfyOutputDir: Deno.env.get("COMFY_OUTPUT_DIR") || "",
            revalidateSecret: Deno.env.get("REVALIDATE_SECRET") || "",
            isDev: Deno.env.get("ENV") === "dev",
        };
    }
    return appConfigs;
}
