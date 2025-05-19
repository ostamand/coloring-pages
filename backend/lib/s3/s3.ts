import { S3Client } from "@aws-sdk/client-s3";

import { AppConfigs } from "../types.ts";

export function getS3Client(configs: AppConfigs) {
    return new S3Client({
        region: configs.s3.region,
        credentials: {
            accessKeyId: configs.s3.accessKeyId,
            secretAccessKey: configs.s3.secretAccessKey,
        },
    });
}
