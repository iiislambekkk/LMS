"use server"

import {requireAdmin} from "@/app/data/admin/require-user";
import {ApiResponse} from "@/lib/types";
import {chapterSchema, ChapterSchemaOutputType, courseSchema, CourseSchemaOutputType} from "@/lib/zodSchemas";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export async function editCourse(data: CourseSchemaOutputType, courseId: string) : Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        const result = courseSchema.safeParse(data)

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid data"
            }
        }

        const course = result.data

        await prisma.course.update({
            where: {
                id: courseId,
                userId: session.user.id
            },
            /* eslint-disable @typescript-eslint/ban-ts-comment  */
            // @ts-ignore
            data: {
                ...course
            }
        })

        return {
            status: "success",
            message: "Course updated successfully"
        }
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: "An error occured"
        }
    }
}

export async function reorderLessons
(
    chapterId: string,
    lessons: {id: string, position: number}[],
    courseId: string
) : Promise<ApiResponse>
{
    try {

        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "No lessons were found"
            }
        }

        const updates = lessons.map(lesson => prisma.lesson.update({
            where: {
                id: lesson.id,
                chapterId: chapterId
            },
            data: {
                position: lesson.position
            }
        }))

        await prisma.$transaction(updates)

        revalidatePath(`/admin/course/${courseId}/edit`)

        return {
            status: "success",
            message: "Lessons reordered successfully"
        }
    }
    catch (error) {
        console.log(error)
        return {
            message: "Error",
            status: "error",
        }
    }
}

export async function reorderChapters
(
        courseId: string,
        chapters: {id: string, position: number}[],
) : Promise<ApiResponse>
{
    try {

        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "No chapters were found"
            }
        }

        const updates = chapters.map(chapter => prisma.chapter.update({
            where: {
                id: chapter.id,
                courseId: courseId
            },
            data: {
                position: chapter.position
            }
        }))

        await prisma.$transaction(updates)

        revalidatePath(`/admin/course/${courseId}/edit`)

        return {
            status: "success",
            message: "Chapters reordered successfully"
        }
    }
    catch (error) {
        console.log(error)
        return {
            message: "Error",
            status: "error",
        }
    }
}


export async function createChapter(formData : ChapterSchemaOutputType) : Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        const result = chapterSchema.safeParse(formData)

        if (!result.success) {
            return {
                status: "error",
                message: "Failed to create chapter"
            }
        }

        const validFormData = result.data

        await prisma.$transaction(async tx => {
            const maxPos = await tx.chapter.findFirst({
                where: {
                    courseId: validFormData.courseId,
                },
                select: {
                    position: true
                },
                orderBy: {
                    position: "desc"
                }
            })

            await tx.chapter.create({
                data: {
                    title: validFormData.name,
                    courseId: validFormData.courseId,
                    position: (maxPos?.position ?? 0) + 1
                }
            })
        })

        revalidatePath(`/admin/course/${validFormData.courseId}/edit`)

        return {
            status: "success",
            message: "Created chapter"
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















