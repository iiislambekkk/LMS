"use client"
import React, {useTransition} from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import slugify from "slugify";
import {Loader2, PlusIcon, SparklesIcon} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/fileUploader/Uploader";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    courseCategories,
    courseLevels, courseSchema,
    CourseSchemaInputType,
    CourseSchemaOutputType,
    courseStatuses
} from "@/lib/zodSchemas";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {editCourse} from "@/app/admin/courses/[courseId]/edit/actions";
import {AdminCourseSingularType} from "@/app/data/admin/admin-get-course";

interface IEditCourseFormProps {
    data: AdminCourseSingularType
}

const EditCourseForm = ({data} : IEditCourseFormProps) => {
    const [isPending, startPending] = useTransition();
    const router = useRouter();

    const form = useForm<CourseSchemaInputType, CourseSchemaOutputType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            ...data
        },
    })

    function onSubmit(values: CourseSchemaOutputType) {
        startPending(async () => {
            const {data: result, error} = await tryCatch(editCourse(values, data.id))

            if (error) {
                toast.error("An Unexpected error occured.");
                return
            }

            if (result?.status === "success") {
                toast.success(result.message);
                form.reset()
                router.push("/admin/courses");
            }
            else {
                toast.error(result.message);
            }
        })
    }



    return (
        <div>
            <Form {...form}>
                <form
                    className={"space-y-6"}
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Title"} {...field} />
                                </FormControl>

                                <FormMessage />

                            </FormItem>
                        )}
                    />

                    <div className={"flex gap-4 items-end"}>
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({field}) => (
                                <FormItem className={"w-full"}>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Slug"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type={"button"} className={"w-fit"} onClick={() => {
                            const titleValue = form.getValues("title")
                            const slug = slugify(titleValue)
                            form.setValue("slug", slug, {shouldValidate: true})

                        }}>
                            Generate Slug <SparklesIcon className={"ml-1"} size={16} />
                        </Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="smallDescription"
                        render={({field}) => (
                            <FormItem className={"w-full"}>
                                <FormLabel>Small Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className={"h-[200px]"}
                                        placeholder={"Small Description..."}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem className={"w-full"}>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <RichTextEditor field={field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fileKey"
                        render={({field}) => (
                            <FormItem className={"w-full"}>
                                <FormLabel>Thumbnail image</FormLabel>
                                <FormControl>
                                    <Uploader fileTypeAccepted={"image"} value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                        <FormField
                            control={form.control}
                            name="category"
                            render={({field}) => (
                                <FormItem className={"w-full"}>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={"w-full"}>
                                                <SelectValue placeholder={"Select category"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courseCategories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="level"
                            render={({field}) => (
                                <FormItem className={"w-full"}>
                                    <FormLabel>Level</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={"w-full"}>
                                                <SelectValue placeholder={"Select value"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courseLevels.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({field}) => (
                                <FormItem className={"w-full"}>
                                    <FormLabel>Duration (hours)</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Duration"} type={"number"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem className={"w-full"}>
                                    <FormLabel>Price ($)</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Orice"} type={"number"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="status"
                        render={({field}) => (
                            <FormItem className={"w-full"}>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className={"w-full"}>
                                            <SelectValue placeholder={"Select status"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {courseStatuses.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type={"submit"} disabled={isPending} className={"flex justify-self-end"}>
                        {!isPending && (
                            <>
                                Update Course <PlusIcon size={16} className={"ml-1"} />
                            </>
                        )}

                        {isPending && (
                            <>
                                Updating...
                                <Loader2 className={"animate-spin ml-1"} />
                            </>
                        )}
                    </Button>
                </form>
            </Form>

        </div>
    );
};

export default EditCourseForm;