"use client"
import React, {useTransition} from 'react';
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {tryCatch} from "@/hooks/try-catch";
import {enrollInCourseAction} from "@/app/(public)/courses/[slug]/actions";
import {Loader2} from "lucide-react";

const EnrollmentButton = ({courseId}: {courseId: string}) => {
    const [isPending, startPending] = useTransition();

    const onSubmit = () => {
        startPending(async () => {
            const {data: result, error} = await tryCatch(enrollInCourseAction(courseId))

            if (error) {
                toast.error("An unexpected error occurred.");
                return;
            }

           if (result?.status === "success") {
               toast.success(result.message);
           }
           else {
               toast.error(result!.message);
           }
        })


    }

    return (
        <Button onClick={onSubmit} disabled={isPending}  className={"w-full"}>
            {!isPending && "Enroll now"}

            {isPending && (
                <>
                    <Loader2 className={"animate-spin ml-1"} />
                    Loading...
                </>
            )}
        </Button>
    );
};

export default EnrollmentButton;