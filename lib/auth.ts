import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {prisma} from "./prisma";
import {env} from "./env";
import {admin, emailOTP} from "better-auth/plugins";
import {resend} from "@/lib/resend";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_CLIENT_SECRET
        }
    },

    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                const { data, error } = await resend.emails.send({
                    from: "PharosLMS <no-reply@notifications.mektep32.org>",
                    to: [email],
                    subject: 'PharosLMS - Verify your email',
                    html: `<p>Your OTP is <strong>${otp}</strong></p>`
                });
            },
        }),

        admin()
    ]
});