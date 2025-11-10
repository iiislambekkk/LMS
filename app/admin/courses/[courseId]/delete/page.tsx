"use client"

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants } from '@/components/ui/button';
import {CourseSchemaOutputType} from "@/lib/zodSchemas";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {deleteCourse} from "@/app/admin/courses/[courseId]/delete/actions";
import {useParams, useRouter} from "next/navigation";
import {Loader2, Trash2} from 'lucide-react';

const Page = () => {
    const [isPending, startPending] = useTransition();
    const {courseId} = useParams<{courseId: string}>()
    const router = useRouter()

    const onSubmit = () => {
        startPending(async () => {
            const {data: result, error} = await tryCatch(deleteCourse(courseId))

            if (error) {
                toast.error("An Unexpected error occured.");
                return
            }

            if (result?.status === "success") {
                toast.success(result.message);
                router.push("/admin/courses");
            }
            else {
                toast.error(result.message);
            }
        })
    }

    return (
        <div className={"max-w-xl mx-auto w-full"}>
            <Card className={"mt-32"}>
                <CardHeader>
                    <CardTitle>Are you sure you want to delete course?</CardTitle>
                    <CardDescription>This action cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent className={"flex items-center gap-2 justify-end"}>
                    <Link className={buttonVariants({
                        variant: "outline"
                    })} href={"/admin/courses"}>
                        Cancel
                    </Link>
                    <Button variant={"destructive"} disabled={isPending} onClick={onSubmit}>
                        {isPending && (
                            <>
                                <Loader2 className={"size-4"}/>
                                Deleting...
                            </>
                        )}

                        {!isPending && (
                            <>
                                <Trash2 className={"size-4"}/>
                                Delete
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;