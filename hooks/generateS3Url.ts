import {env} from "@/lib/env";

export function generateS3Url(key: string) {
    return `${env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${key}`
}