import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { exists } from "jsr:@std/fs";

import { getRandomFilename } from "../helpers.ts";

const DEFAULT_BUCKET = "ai-coloring-pages";

export async function uploadImageToS3(
    s3: S3Client,
    inputFilename: string,
    folder?: string,
    bucket?: string,
) {
    const outputFolder = folder || "";
    const outputBucket = bucket || DEFAULT_BUCKET;
    if (!exists(inputFilename)) {
        throw new Error(`${inputFilename} does not exist.`);
    }
    try {
        const extension = inputFilename.split(".").pop() || "";
        const imageContent = await Deno.readFile(
            inputFilename,
        );

        let key = outputFolder ? `${outputFolder}/` : "";
        key += getRandomFilename(inputFilename);

        const command = new PutObjectCommand({
            Bucket: outputBucket,
            Key: key,
            Body: imageContent,
            ContentType: `image/${extension}`,
        });

        await (s3 as any).send(command);

        return { key };
    } catch (error) {
        console.error(error);
        return {};
    }
}
