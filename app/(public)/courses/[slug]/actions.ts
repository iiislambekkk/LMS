"use server"

import {ApiResponse} from "@/lib/types";
import {requireUser} from "@/app/data/user/requireUser";
import {prisma} from "@/lib/prisma";
import {stripe} from "@/lib/stripe";
import Stripe from "stripe";
import {redirect} from "next/navigation";
import {env} from "@/lib/env";

export async function enrollInCourseAction(courseId: string): Promise<ApiResponse | undefined> {
    const {user} = await requireUser()

    let checkoutUrl: string;
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
                id: user.id
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
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id
                }
            })

            stripeCustomerId = customer.id

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    stripeCustomerId: stripeCustomerId,
                }
            })
        }

        const result = await prisma.$transaction(async (tx) => {
            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: courseId
                    }
                }
            })

            if (existingEnrollment?.status === "Active") {
                return {
                    status: "success",
                    message: `You are already enrolled in this course`
                }
            }

            let enrollment;

            if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id
                    },
                    data: {
                        amount: course.price,
                        status: "Pending",
                        updatedAt: new Date()
                    }
                })
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: courseId,
                        amount: course.price,
                        status: "Pending"
                    }
                })
            }

            const checkoutSession =  await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        price: "price_1SRwdWCmqDLurcRBfLxScMQM",
                        quantity: 1
                    }
                ],
                mode: "payment",
                cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                metadata: {
                    userId: user.id,
                    courseId: courseId,
                    enrollmentId: enrollment.id
                }
            })

            return {
                enrollment,
                checkoutUrl: checkoutSession.url
            }
        })

        checkoutUrl = result.checkoutUrl!
    }
    catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            return {
                status: "error",
                message: "Payment error."
            }
        }

        return {
            status: "error",
            message: "Failed to enroll in course",
        }
    }
    finally {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (checkoutUrl) redirect(checkoutUrl);
    }
}