import "server-only"

import {S3Client} from "@aws-sdk/client-s3";
import {env} from "@/lib/env";

export const S3 = new S3Client({
    region: "auto",
    endpoint: env.AWS_ENDPOINT_URL,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_KEY
    },
    forcePathStyle: false,
})