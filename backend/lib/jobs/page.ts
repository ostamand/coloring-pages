import { Client } from "jsr:@db/postgres";
import { S3Client } from "@aws-sdk/client-s3";
import { expandGlob } from "jsr:@std/fs/expand-glob";

import { addNewPage } from "../db/mod.ts";
import { GenerationConfigs } from "../types.ts";
import { uploadImageToS3 } from "../s3/mod.ts";

type PageData = {
    config: GenerationConfigs;
    coloringPath: string | null;
    coloredPath: string | null;
};

export async function importFromFolder(
    db: Client,
    s3: S3Client,
    folderPath: string,
    cloudfrontUrl: string,
) {
    // list all configs in folder
    const configPaths = await Array.fromAsync(
        expandGlob("*.json", { root: folderPath }),
    );

    for (const configPath of configPaths) {
        try {
            console.log(`🏃Processing: ${configPath.path}`);
            await db.queryObject("BEGIN");
            const decoder = new TextDecoder("utf-8");
            const data = Deno.readFileSync(configPath.path);
            const generationConfig: GenerationConfigs = JSON.parse(
                decoder.decode(data),
            );

            const pageData: PageData = {
                config: generationConfig,
                coloredPath: null,
                coloringPath: null,
            };

            if (!generationConfig.coloringImagePath) break;

            // export image to s3: coloring page
            const { key: outputKey } = await uploadImageToS3(
                s3,
                generationConfig.coloringImagePath,
                "coloring",
            );
            if (!outputKey) {
                throw new Error();
            }
            pageData.coloringPath = `${cloudfrontUrl}/${outputKey}`;

            // save to database
            await addNewPage(db, pageData.coloringPath, pageData.config);

            await db.queryObject("COMMIT");

            console.log(`✅ Done`);
        } catch (_) {
            db.queryObject("ROLLBACK");
            console.error(`❌ Failed to process ${configPath.path}`);
        }
    }
}
