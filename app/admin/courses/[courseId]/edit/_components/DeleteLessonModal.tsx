import React, {useTransition} from 'react';
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {deleteLesson} from "@/app/admin/courses/[courseId]/edit/actions";
import {toast} from "sonner";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const DeleteLessonModal = (
    {
        chapterId,
        courseId,
        lessonId
    }
    :
    {
        chapterId : string,
        courseId : string,
        lessonId : string
    }
) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isPending, startPending] = useTransition();

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    }

    const onSubmit = () => {

        const data = {
            chapterId,
            courseId,
            lessonId
        }

        startPending(async () => {
            toast.promise(deleteLesson(data), {
                loading: 'Deleting the lesson...',
                success: (result) => {
                    if (result.status == "success") return result.message
                },
                error: () => {
                    return "Failed to delete the lesson"
                },
                finally: () => {
                    handleOpenChange(false)
                }
            })
        })


    }

    return (
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <Button variant={"outline"} size={"sm"} className={"gap-2"}>
                    <Trash2 className={"size-4"} />
                    Delete Lesson
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className={"mt-6"}>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <Button disabled={isPending} onClick={onSubmit}>
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteLessonModal;