import {prisma} from "@/lib/prisma";
import {requireUser} from "@/app/data/user/requireUser";
import {notFound} from "next/navigation";

export async function getLessonContent(lessonId: string)  {
    const {user} = await requireUser()

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            thumbnailKey: true,
            videoKey: true,
            position: true,

            chapter: {
                select: {
                    courseId: true,
                    course: {
                        select: {
                            slug: true,
                        }
                    }
                }
            },

            lessonProgress: {
                where: {
                    userId: user.id
                },
                select: {
                    completed: true,
                    lessonId: true
                }
            }
        }
    });

    if (!lesson) {
        return notFound()
    }


    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: lesson.chapter.courseId
            }
        },
        select: {
            status: true
        }
    })

    if (!enrollment || enrollment.status !== "Active") {
        return notFound()
    }

    return lesson
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>

