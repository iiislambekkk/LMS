import {NextResponse} from "next/server";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {env} from "@/lib/env";
import {S3} from "@/lib/s3Client";
import {requireAdmin} from "@/app/data/admin/require-user";

export async function DELETE(req: Request) {
    const session = await requireAdmin()

    try {
        const body = await req.json()
        const key = body.key

        if (!key) {
            return NextResponse.json(
                {error: "Invalid or missing key"},
                {status: 400}
            )
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME,
            Key: key
        })

        await S3.send(command)

        return NextResponse.json({
            message: `Deleted file successfully.`,
        }, {status: 200})
    }
    catch (error) {
        console.error(error)
        return NextResponse.json(
            {error: "Failed to delete file"},
            {status: 500}
        )
    }
}