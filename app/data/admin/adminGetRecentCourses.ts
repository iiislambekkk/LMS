import {requireAdmin} from "@/app/data/admin/require-user";
import {prisma} from "@/lib/prisma";

export async function getRecentCourses() {
    await requireAdmin()

    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: "desc"
        },
        take: 2,
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