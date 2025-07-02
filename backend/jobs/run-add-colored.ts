import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getDatabaseClient } from "../lib/db/db.ts";
import { loadAppConfigs } from "../lib/configs.ts";
import { getPageByUniqueName } from "../lib/db/page.ts";
import { Page } from "../lib/db/types.ts";

const DEFAULT_BUCKET = "ai-coloring-pages";

async function addColored(imagePath: string, uniqueName: string) {
    const configs = loadAppConfigs();
    const db = getDatabaseClient(configs);

    const s3 = new S3Client({
        region: configs.s3.region,
        credentials: {
            accessKeyId: configs.s3.accessKeyId,
            secretAccessKey: configs.s3.secretAccessKey,
        },
    });

    // get coloring page from database
    const results = await getPageByUniqueName(db, uniqueName);
    const page = results[0] as Page;

    // upload image to s3
    const extension = imagePath.split(".").pop() || "";
    const imageContent = await Deno.readFile(
        imagePath,
    );

    const splits = page.thumbnail_path.split("/");
    const fileKey = splits[splits.length - 1];

    const command = new PutObjectCommand({
        Bucket: DEFAULT_BUCKET,
        Key: `colored/original/${fileKey}`,
        Body: imageContent,
        ContentType: `image/${extension}`,
    });

    await (s3 as any).send(command);

    // update database
    await db.queryObject(
        "UPDATE pages SET colored_path=$1 WHERE unique_name=$2",
        [page.thumbnail_path.replace("coloring", "colored"), uniqueName],
    );
}

async function main(args: string[]) {
    const coloredIndex = args.indexOf("--colored");
    const coloredPath = coloredIndex !== -1
        ? args[coloredIndex + 1]
        : undefined;

    const uniqueNameIndex = args.indexOf("--name");
    const uniqueName = uniqueNameIndex !== -1
        ? args[uniqueNameIndex + 1]
        : undefined;

    if (!coloredPath) {
        console.log("❌ Colored image path is required (--colored).");
        return;
    }
    if (!uniqueName) {
        console.log("❌ Coloring page unique name is required (--name).");
        return;
    }
    await addColored(coloredPath, uniqueName);
}

if (import.meta.main) {
    main(Deno.args);
}
