"use server"

import {requireUser} from "@/app/data/user/requireUser";
import {ApiResponse} from "@/lib/types";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export async function markLessonComplete(lessonId: string, slug: string) : Promise<ApiResponse> {
    const {user} = await requireUser()

    try {
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId
                }
            },
            update: {
                completed: true
            },
            create: {
                lessonId,
                userId: user.id,
                completed: true
            }
        })

        revalidatePath(`/dashboard/${slug}`)

        return {
            status: "success",
            message: "Lesson has been successfully marked completed."
        }
    }
    catch (e) {
        return {
            status: "error",
            message: "Error ocurred"
        }
    }
}