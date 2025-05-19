import { Client } from "@db/postgres";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getDatabaseClient } from "../lib/db/db.ts";
import { loadAppConfigs } from "../lib/configs.ts";
import { getS3Client } from "../lib/s3/s3.ts";
import { AppConfigs } from "../lib/types.ts";

const deleteFile = async (
    s3: S3Client,
    bucketName: string,
    fileKey: string,
) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
        };
        await s3.send(new DeleteObjectCommand(params));
        console.log(`✅ Deleted ${fileKey} from s3`);
    } catch (error) {
        console.log(`❌ Failed to delete from s3 ${fileKey}`, error);
    }
};

async function deletePage(
    db: Client,
    s3: S3Client,
    configs: AppConfigs,
    id: number,
) {
    // delete page from database
    const result = await db.queryObject(
        "DELETE FROM pages where id = $1 RETURNING *",
        [id],
    );
    if (result.rowCount !== 1) {
        throw new Error(`❌ Unable to delete page id ${id}`);
    }

    const page = result.rows[0];

    const { full_path, thumbnail_path } = page as any;

    const fullPathKey = (full_path as string).replace(
        configs.cloudfrontUrl + "/",
        "",
    );

    const thumbnailPathKey = (thumbnail_path as string).replace(
        configs.cloudfrontUrl + "/",
        "",
    );

    await deleteFile(s3, configs.s3.bucket, fullPathKey);
    await deleteFile(s3, configs.s3.bucket, thumbnailPathKey);
}

async function main(args: string[]) {
    const idIndex = args.indexOf("--id");
    console.log(idIndex);
    if (idIndex === -1) {
        console.log("❌ Page id required (--id )");
        return;
    }
    const id = Number(Deno.args[idIndex + 1]);

    const configs = loadAppConfigs();
    const db = getDatabaseClient(configs);
    const s3 = getS3Client(configs);

    await deletePage(db, s3, configs, id);

    console.log(`✅ Page id ${id} deleted successfully`);
}

// example: deno run --allow-all --id
if (import.meta.main) {
    main(Deno.args);
}
