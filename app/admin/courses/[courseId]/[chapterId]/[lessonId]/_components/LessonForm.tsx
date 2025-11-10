"use client"

import React, {useState} from 'react';
import {AdminLessonType} from "@/app/data/admin/admin-get-lesson";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useForm} from "react-hook-form";
import {
    lessonSchema,
    LessonSchemaInputType,
    LessonSchemaOutputType
} from "@/lib/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/fileUploader/Uploader";
import {updateLesson} from "@/app/admin/courses/[courseId]/[chapterId]/[lessonId]/actions";
import {toast} from "sonner";

interface IProps {
    data: AdminLessonType
    chapterId: string
    courseId: string
}

const LessonForm = ({data, chapterId, courseId} : IProps) => {
    const [isPending, setIsPending] = useState<boolean>(false);

    const form = useForm<LessonSchemaInputType, LessonSchemaOutputType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            description: data.description ?? undefined,
            name: data.title,
            chapterId: chapterId,
            courseId: courseId,
            videoKey: data.videoKey ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined
        },
    })

    const onSubmit = async (values: LessonSchemaOutputType) => {

        const update = async () => {
            setIsPending(true);
            try {
                return await updateLesson(values, data.id)
            }
            finally {
                setIsPending(false)
            }
        }

        toast.promise(update, {
            loading: `Updating lesson`,
            success: (result) => {
                if (result.status == "success") return result.message
            },
            error: () => {
                return "Failed to update"
            }
        })
    }

    return (
        <div>
            <Link href={`/admin/courses/${courseId}/edit`} className={buttonVariants({
                variant: "outline",
                className: "mb-6"
            })}>
                <ArrowLeft className={"size-4"}/>
                <span className={""}>Go back</span>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Lesson configuration</CardTitle>
                    <CardDescription>Configure video and description for this lesson</CardDescription>
                </CardHeader>

                <CardContent className={""}>
                    <Form {...form}>
                        <form className={"space-y-6"} onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => {

                                    return (
                                        <FormItem>
                                            <FormLabel>Lesson Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder={"Lesson ..."} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => {

                                    return (
                                        <FormItem>
                                            <FormLabel>Lesson Description</FormLabel>
                                            <FormControl>
                                                <RichTextEditor field={field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />

                            <FormField
                                control={form.control}
                                name="thumbnailKey"
                                render={({field}) => {

                                    const value = field.value == undefined ? "" : field.value;

                                    return (
                                        <FormItem>
                                            <FormLabel>Thumbnail</FormLabel>
                                            <FormControl>
                                                <Uploader onChange={field.onChange} value={value} fileTypeAccepted={"image"} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />

                            <FormField
                                control={form.control}
                                name="videoKey"
                                render={({field}) => {

                                    const value = field.value == undefined ? "" : field.value;

                                    return (
                                        <FormItem>
                                            <FormLabel>Video</FormLabel>
                                            <FormControl>
                                                <Uploader onChange={field.onChange} value={value} fileTypeAccepted={"video"} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />

                            <Button className={"flex justify-self-end"} type={"submit"}>Update Lesson</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LessonForm;