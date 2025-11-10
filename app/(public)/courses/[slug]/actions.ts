"use server"

import {ApiResponse} from "@/lib/types";
import {requireUser} from "@/app/data/user/requireUser";
import {prisma} from "@/lib/prisma";

export async function enrollInCourseAction(courseId: string): Promise<ApiResponse> {
    const session = await requireUser()

    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                id: true,
                title: true,
                slug: true,
                price: true
            }
        })

        if (!course) {
            return {
                status: "error",
                message: `Course not found!`
            }
        }

        let stripeCustomerId: string;
        const userWithStripeCustomerId = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                id: true,
                stripeCustomerId: true
            }
        })

        if (userWithStripeCustomerId?.stripeCustomerId) {
            stripeCustomerId = userWithStripeCustomerId.stripeCustomerId
        }
        else {

        }

    }
    catch (error) {
        return {
            status: "error",
            message: "Failed to enroll in course",
        }
    }
}