import {requireAdmin} from "@/app/data/admin/require-user";
import {prisma} from "@/lib/prisma";

export async function adminGetDashboardStats() {
    await requireAdmin()

    const [totalSignups, totalCustomers, totalCourses, totalLessons] = await Promise.all([
        prisma.user.count(),

        prisma.user.count({
            where: {
                enrollments: {
                    some: {}
                }
            }
        }),

        prisma.course.count(),

        prisma.lesson.count()
    ])

    return {
        totalSignups, totalCustomers, totalCourses, totalLessons
    }
}