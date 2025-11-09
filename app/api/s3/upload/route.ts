import {z} from "zod";
import {NextResponse} from "next/server";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {env} from "@/lib/env";
import {v4 as uuidv4} from "uuid";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {S3} from "@/lib/s3Client";
import {requireAdmin} from "@/app/data/admin/require-user";

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, {message: "Filename is required"}),
    contentType: z.string().min(1, {message: "ContentType is required"}),
    size: z.number().min(1, {message: "Size is required"}),
    isImage: z.boolean()
})

export async function POST(req: Request) {
    // const session = await requireAdmin()

    try {
        const body = await req.json()

        const validation = fileUploadSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                {error: "Invalid Request body"},
                {status: 400}
            )
        }

        const {fileName, contentType, size, isImage} = validation.data

        const uniqueKey = `${uuidv4()}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueKey
        })

        const presignedUrl = await getSignedUrl(S3, command, {
            expiresIn: 360 // seconds
        })

        return NextResponse.json({
            presignedUrl,
            key: uniqueKey
        })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json(
            {error: "Failed to generate presigned URL"},
            {status: 500}
        )
    }
}