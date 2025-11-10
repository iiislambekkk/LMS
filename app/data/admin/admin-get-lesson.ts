"use server"

import {requireAdmin} from "@/app/data/admin/require-user";
import { prisma } from "@/lib/prisma";
import {notFound} from "next/navigation";

export async function adminGetLesson(id: string) {
    await requireAdmin();

    const data = await prisma.lesson.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            description: true,
            videoKey: true,
            thumbnailKey: true,
            position: true,
        }
    })

    if (!data) {
        return notFound()
    }

    return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>
