import React, {useTransition} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {
    lessonSchema, LessonSchemaInputType, LessonSchemaOutputType,
} from "@/lib/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {createLesson} from "@/app/admin/courses/[courseId]/edit/actions";
import {toast} from "sonner";

const NewLessonModal = ({courseId, chapterId} : {courseId : string, chapterId: string}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isPending, startPending] = useTransition();

    const form = useForm<LessonSchemaInputType, LessonSchemaOutputType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: "",
            courseId: courseId,
            chapterId
        },
    })

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    }

    const onSubmit = (values: LessonSchemaOutputType) => {

        startPending(async () => {
            toast.promise(createLesson(values), {
                loading: 'Creating the lesson...',
                success: (result) => {
                    if (result.status == "success") return result.message
                },
                error: () => {
                    return "Failed to create the lesson"
                },
                finally: () => {
                    form.reset()
                    handleOpenChange(false)
                }
            })
        })


    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"sm"} className={"gap-2 mt-4"}>
                    <PlusIcon className={"size-4"} />
                    New Lesson
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create new Lesson
                    </DialogTitle>
                    <DialogDescription>
                        What would you like to name your Lesson?
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name={"name"}
                            render={({field}) => {

                                return (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder={"Chapter Name"} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        <DialogFooter className={"mt-6"}>
                            <Button disabled={isPending} type={"submit"}>
                                Save Change
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default NewLessonModal;