import {prisma} from "@/lib/prisma";

export async function getAllCourses() {
    const data = await prisma.course.findMany({
        where: {
            status: "Published"
        },
        orderBy: {
            createdAt: "desc"
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
        }
    })

    return data
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0]
