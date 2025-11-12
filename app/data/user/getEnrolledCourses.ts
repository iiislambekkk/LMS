import "server-only"
import {requireUser} from "@/app/data/user/requireUser";
import {prisma} from "@/lib/prisma";
import {getCourseBySlug} from "@/app/data/course/getCourse";

export async function getEnrolledCourses() {
    const {user} = await requireUser()

    const data = await prisma.enrollment.findMany({
        where: {
            userId: user.id,
            status: "Active"
        },
        select: {
            id: true,
            course: {
                select: {
                    id: true,
                    title: true,
                    smallDescription: true,
                    duration: true,
                    level: true,
                    fileKey: true,
                    slug: true,

                    chapters: {
                        select: {
                            id: true,
                            lessons: {
                                select: {
                                    id: true,

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
                            }
                        }
                    }
                }
            }
        }
    })

    return data
}

export type EnrolledCoursesType = Awaited<ReturnType<typeof getEnrolledCourses>>[0]
