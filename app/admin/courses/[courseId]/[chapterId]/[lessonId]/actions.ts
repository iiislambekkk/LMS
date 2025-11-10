"use server"


import {lessonSchema, LessonSchemaOutputType} from "@/lib/zodSchemas";
import {ApiResponse} from "@/lib/types";
import {requireAdmin} from "@/app/data/admin/require-user";
import {prisma} from "@/lib/prisma";

export async function updateLesson(formData : LessonSchemaOutputType, lessonId: string) : Promise<ApiResponse> {
    await requireAdmin()

    try {
        const result = lessonSchema.safeParse(formData)

        if (!result.success) {
            return {
                status: "error",
                message: "Failed to update lesson"
            }
        }

        const validFormData = result.data

        await prisma.$transaction(async tx => {

            await tx.lesson.update({
                where: {
                    id: lessonId
                },
                data: {
                    title: validFormData.name,
                    description: validFormData.description,
                    videoKey: validFormData.videoKey,
                    thumbnailKey: validFormData.thumbnailKey,
                }
            })
        })

        return {
            status: "success",
            message: "Lesson updated successfully"
        }
    }
    catch (e) {
        console.log(e)
        return {
            status: "error",
            message: "An error occured"
        }
    }
}