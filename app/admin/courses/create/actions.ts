"use server"

import {courseSchema, CourseSchemaOutputType} from "@/lib/zodSchemas";
import {prisma} from "@/lib/prisma";
import {ApiResponse} from "@/lib/types";
import { auth } from "@/lib/auth";
import {headers} from "next/headers";
import {requireAdmin} from "@/app/data/admin/require-user";

export async function CreateCourse(values: CourseSchemaOutputType) : Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        if (!session) {
            return {
                status: "error",
                message: `User session not found!.`,
            }
        }

        const validation = courseSchema.safeParse(values);

        if (!validation.success) {
            return {
                status: "error",
                message: `Invalid Form Data.`,
            }
        }

        const data = await prisma.course.create({
            /* eslint-disable @typescript-eslint/ban-ts-comment  */
            // @ts-ignore
            data: {
                ...validation.data,
                userId: session.user.id as string
            }
        })

        return {
            status: "success",
            message: `Created Course Successfully.`,
        }
    }
    catch (error) {
        console.log(error)

        return {
            status: "error",
            message: `Invalid Form Data.`,
        }
    }
}