import "server-only"
import {requireUser} from "@/app/data/user/requireUser";
import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";

export const getCourseSidebarData = async (slug: string) => {
    const session = await requireUser()

    const course = await prisma.course.findUnique({
        where: {
            slug
        },
        select: {
            id: true,
            title: true,
            fileKey: true,
            duration: true,
            level: true,
            category: true,
            slug: true,

            chapters: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        orderBy: {
                            position: "asc"
                        },
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            position: true,

                            lessonProgress: {
                                where: {
                                    userId: session.user.id
                                },
                                select: {
                                    completed: true,
                                    lessonId: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    })

    if (!course) {
        return notFound()
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId: course.id
            }
        },
        select: {
            status: true
        }
    })

    if (!enrollment || enrollment.status !== "Active") {
        return notFound()
    }

    return {course}
}

export type CoursSidebarDataType = Awaited<ReturnType<typeof getCourseSidebarData>>
