"use server"

import {requireAdmin} from "@/app/data/admin/require-user";
import {ApiResponse} from "@/lib/types";
import {
    chapterSchema,
    ChapterSchemaOutputType,
    courseSchema,
    CourseSchemaOutputType,
    lessonSchema
} from "@/lib/zodSchemas";
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
    const session = await requireAdmin()

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
    const session = await requireAdmin()

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
            message: "Chapter created successfully"
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

export async function createLesson(formData : ChapterSchemaOutputType) : Promise<ApiResponse> {
    await requireAdmin()

    try {
        const result = lessonSchema.safeParse(formData)

        if (!result.success) {
            return {
                status: "error",
                message: "Failed to create chapter"
            }
        }

        const validFormData = result.data

        await prisma.$transaction(async tx => {
            const maxPos = await tx.lesson.findFirst({
                where: {
                    chapterId: validFormData.chapterId
                },
                select: {
                    position: true
                },
                orderBy: {
                    position: "desc"
                }
            })

            await tx.lesson.create({
                data: {
                    title: validFormData.name,
                    description: validFormData.description,
                    videoKey: validFormData.videoKey,
                    thumbnailKey: validFormData.thumbnailKey,
                    chapterId: validFormData.chapterId,
                    position: (maxPos?.position ?? 0) + 1
                }
            })
        })

        revalidatePath(`/admin/course/${validFormData.courseId}/edit`)

        return {
            status: "success",
            message: "Lesson created successfully"
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


export async function deleteLesson(
    {
        chapterId,
        courseId,
        lessonId
    }
    :
    {
        chapterId : string,
        courseId : string,
        lessonId : string
    }
) : Promise<ApiResponse> {

    await requireAdmin()

    try {
        const chapterWithLessons = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
            },
            select: {
                lessons: {
                    orderBy: {
                        position: "asc"
                    },
                    select: {
                        id: true,
                        position: true
                    }
                }
            }
        })

        if (!chapterWithLessons) {
            return {
                status: "error",
                message: "Chapter not found"
            }
        }

        const lessons = chapterWithLessons.lessons

        const lessonToDelete = lessons.find(l => l.id === lessonId)
        const indexOfLessonToDelete = lessons.findIndex(l => l.id === lessonId)

        if (!lessonToDelete || indexOfLessonToDelete === -1) {
            return {
                status: "error",
                message: "Lesson not found"
            }
        }

        const remainingLessons = lessons.filter(((l, index) => l.id !== lessonId && index > indexOfLessonToDelete))

        const updates = remainingLessons.map(((l, index) => {
            return prisma.lesson.update({
                where: {id: l.id},
                data: {position: l.position-1}
            })
        }))

        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    chapterId: chapterId
                }
            })
        ])

        revalidatePath(`/admin/course/${courseId}/edit`)

        return {
            status: "success",
            message: "Lesson deleted successfully"
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



export async function deleteChapter(
    {
        chapterId,
        courseId,
    }
    :
    {
        chapterId : string,
        courseId : string,
    }
) : Promise<ApiResponse> {

    await requireAdmin()

    try {
        const courseWithChapters = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                chapters: {
                    orderBy: {
                        position: "asc"
                    },
                    select: {
                        id: true,
                        position: true
                    }
                }
            }
        })

        if (!courseWithChapters) {
            return {
                status: "error",
                message: "Course not found"
            }
        }

        const chapters = courseWithChapters.chapters

        const chapterToDelete = chapters.find(l => l.id === chapterId)
        const indexOfChapterToDelete = chapters.findIndex(l => l.id === chapterId)

        if (!chapterToDelete || indexOfChapterToDelete === -1) {
            return {
                status: "error",
                message: "Chapter not found"
            }
        }

        const remainingChapters = chapters.filter(((l, index) => l.id !== chapterId && index > indexOfChapterToDelete))

        const updates = remainingChapters.map(((l) => {
            return prisma.chapter.update({
                where: {id: l.id},
                data: {position: l.position-1}
            })
        }))

        await prisma.$transaction([
            ...updates,
            prisma.chapter.delete({
                where: {
                    id: chapterId,
                    courseId: courseId
                }
            })
        ])

        revalidatePath(`/admin/course/${courseId}/edit`)

        return {
            status: "success",
            message: "Chapter deleted successfully"
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
























