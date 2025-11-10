import {prisma} from "@/lib/prisma";

export async function getCourseBySlug(slug: string) : GetCourseBySlugType {
    return prisma.course.findUnique({
        where: {
            slug
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            description: true,
            category: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,

            chapters: {
                orderBy: {
                    position: "asc"
                },
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
                            title: true
                        }
                    }
                }
            }
        }
    });
}

export type GetCourseBySlugType = Awaited<ReturnType<typeof getCourseBySlug>>
