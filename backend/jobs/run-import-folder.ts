import { S3Client } from "@aws-sdk/client-s3";
import { Client } from "jsr:@db/postgres";

import { loadAppConfigs } from "../lib/configs.ts";
import { importFromFolder } from "../lib/jobs/page.ts";

async function importFolder(folderPath: string) {
    const configs = loadAppConfigs();

    const s3 = new S3Client({
        region: configs.s3.region,
        credentials: {
            accessKeyId: configs.s3.accessKeyId,
            secretAccessKey: configs.s3.secretAccessKey,
        },
    });

    const db = new Client({
        database: configs.db.name,
        port: configs.db.port,
        user: configs.db.user,
        password: configs.db.password,
        hostname: configs.db.hostname,
    });

    try {
        await importFromFolder(
            db,
            s3,
            folderPath,
            configs.cloudfrontUrl,
        );
    } finally {
        await db.end();
    }
}

function main(args: string[]) {
    const inIndex = args.indexOf("--in");
    const inFolder = inIndex !== -1 ? args[inIndex + 1] : undefined;
    if (!inFolder) {
        console.log("❌ Input folder is required (--in).");
        return;
    }
    importFolder(inFolder);
}

if (import.meta.main) {
    main(Deno.args);
}
