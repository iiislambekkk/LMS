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
    chapterSchema,
    ChapterSchemaInputType,
    ChapterSchemaOutputType,
} from "@/lib/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {createChapter} from "@/app/admin/courses/[courseId]/edit/actions";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";

const NewChapterModal = ({courseId} : {courseId : string}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isPending, startPending] = useTransition();

    const form = useForm<ChapterSchemaInputType, ChapterSchemaOutputType>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: "",
            courseId: courseId
        },
    })

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    }

    const onSubmit = (values: ChapterSchemaOutputType) => {

        startPending(async () => {
            toast.promise(createChapter(values), {
                loading: 'Creating the chapter...',
                success: (result) => {
                    if (result.status == "success") return result.message
                },
                error: () => {
                    return "Failed to create the chapter"
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
                <Button variant={"outline"} size={"sm"} className={"gap-2"}>
                    <PlusIcon className={"size-4"} />
                    New Chapter
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create new Chapter
                    </DialogTitle>
                    <DialogDescription>
                        What would you like to name your Chapter?
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

export default NewChapterModal;