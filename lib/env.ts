import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string(),
        BETTER_AUTH_URL: z.url(),
        BETTER_AUTH_SECRET: z.string().min(1),
        AUTH_GITHUB_CLIENT_ID: z.string().min(1),
        AUTH_GITHUB_CLIENT_SECRET: z.string().min(1),
        RESEND_API_KEY: z.string().min(1),
        ARCJET_KEY: z.string().min(1),
        AWS_ACCESS_KEY: z.string().min(1),
        AWS_SECRET_KEY: z.string().min(1),
        AWS_ENDPOINT_URL: z.string().min(1),
        AWS_REGION: z.string().min(1),
        STRIPE_SECRET_KEY: z.string().min(1),
        STRIPE_WEBHOOK_SECRET: z.string().min(1),
    },

    client: {
        NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL: z.string().min(1),
        NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1),
        NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().min(1)
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL,
        NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME,
        NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
    }
});