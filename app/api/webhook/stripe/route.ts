import Stripe from "stripe";
import {stripe} from "@/lib/stripe";
import {env} from "@/lib/env";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.text()

    const headersList = req.headers

    const signature = headersList.get("stripe-signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET
        )
    } catch (e) {
        console.log(e)
        return new Response("Webhook error", {status: 400})
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === "checkout.session.completed") {
        const courseId = session.metadata?.courseId
        const customerId = session.customer as string

        if (!courseId) {
            throw new Error("Course id is missing")
        }

        const user = await prisma.user.findUnique({
            where: {
                stripeCustomerId: customerId,
            }
        })

        if (!user) {
            throw new Error("User not found")
        }

        await prisma.enrollment.update({
            where: {
                id: session.metadata?.enrollmentId as string
            },
            data: {
                userId: user.id,
                courseId: courseId,
                amount: session.amount_total as number,
                status: "Active"
            }
        })
    }

    return new Response(null, {status: 200})
}













