"use server"

import {courseSchema, CourseSchemaOutputType} from "@/lib/zodSchemas";
import {prisma} from "@/lib/prisma";
import {ApiResponse} from "@/lib/types";
import { auth } from "@/lib/auth";
import {headers} from "next/headers";
import {requireAdmin} from "@/app/data/admin/require-user";
import {stripe} from "@/lib/stripe";

export async function CreateCourse(values: CourseSchemaOutputType) : Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        if (!session) {
            return {
                status: "error",
                message: `User session not found!.`,
            }
        }

        const validation = courseSchema.safeParse(values);

        if (!validation.success) {
            return {
                status: "error",
                message: `Invalid Form Data.`,
            }
        }

        const stripeRes = await stripe.products.create({
            name: validation.data.title,
            description: validation.data.smallDescription,
            default_price_data: {
                currency: "usd",
                unit_amount: validation.data.price * 100
            }
        })

        await prisma.course.create({
            /* eslint-disable @typescript-eslint/ban-ts-comment  */
            // @ts-ignore
            data: {
                ...validation.data,
                userId: session.user.id as string,
                stripePriceId: stripeRes.default_price as string
            }
        })

        return {
            status: "success",
            message: `Created Course Successfully.`,
        }
    }
    catch (error) {
        console.log(error)

        return {
            status: "error",
            message: `Invalid Form Data.`,
        }
    }
}