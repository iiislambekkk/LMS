"use client"

import React, {useTransition} from 'react';
import {LessonContentType} from "@/app/data/course/getLessonContent";
import {Button} from "@/components/ui/button";
import {BookIcon, CheckCircle} from "lucide-react";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import {generateS3Url} from "@/hooks/generateS3Url";
import {markLessonComplete} from "@/app/dashboard/[slug]/[lessonId]/actions";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {Skeleton} from "@/components/ui/skeleton";

const VideoPlayer = (
    {
        thumbnailKey,
        videoKey
    }
    :
    {
        thumbnailKey: string;
        videoKey: string;
    }
) => {
    const videoUrl = generateS3Url(videoKey)
    const thumbnailUrl = generateS3Url(thumbnailKey)

    if (!videoKey) {
        return (
            <div className={"aspect-video bg-muted rounded-lg flex flex-col items-center justify-center"}>
                <BookIcon className={"size-16 text-muted-foreground mx-auto mb-4"} />
                <p>The lesson does not have a video yet</p>
            </div>
        )
    }

    return (
        <div className={"aspect-video bg-muted rounded-lg overflow-hidden relative"}>
            <video
               className={"w-full h-fit object-contain"}
               controls
               poster={thumbnailUrl}
            >
                <source src={videoUrl} title={"video/mp4"}/>
                <source src={videoUrl} title={"video/webm"}/>
                <source src={videoUrl} title={"video/pgg"}/>

                Your browser does not support video tag
            </video>
        </div>
    )
}

const CourseContent = ({lesson} : {lesson: LessonContentType}) => {
    const [isPending, startPending] = useTransition();


    function onSubmit() {

        startPending(async () => {
            const {data: result, error} = await tryCatch(markLessonComplete(lesson.id, lesson.chapter.course.slug))

            if (error) {
                toast.error("An Unexpected error occured.");
                return
            }

            if (result?.status === "success") {
                toast.success(result.message);
            }
            else {
                toast.error(result.message);
            }
        })
    }



    return (
        <div className={"flex flex-col h-full bg-background pl-6"}>
            <VideoPlayer videoKey={lesson.videoKey ?? ''} thumbnailKey={lesson.thumbnailKey ?? ''} />

            <div className={"py-4 border-b h-fit bg-background pl-6"}>
                {lesson.lessonProgress.length > 0 && (
                    <Button variant={"outline"} className={"dark:hover:text-green-500! hover:text-green-700"}>
                        <CheckCircle className={"size-4 text-green-500"}/>
                        Completed
                    </Button>
                )}

                {lesson.lessonProgress.length === 0 && (
                    <Button onClick={onSubmit} disabled={isPending} variant={"outline"} className={"dark:hover:text-green-500! hover:text-green-700"}>
                        <CheckCircle className={"size-4 text-green-500"}/>
                        Mark as Complete
                    </Button>
                )}
            </div>

            <div className={"space-y-5 pt-5"}>
                <h1 className={"text-3xl font-bold tracking-tight text-foreground"}>{lesson.title}</h1>

                {lesson.description && (
                    <RenderDescription json={JSON.parse(lesson.description)} />
                )}
            </div>

        </div>
    );
};

export function LessonContentSkeleton() {
    return (
        <div className="space-y-6 px-5">
            {/* Title */}
            <Skeleton className="h-8 w-1/3" />

            {/* Subtitle */}
            <Skeleton className="h-5 w-1/2" />

            {/* Main content */}
            <Skeleton className="h-64 w-full rounded-md" />

            {/* Smaller content sections */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Buttons row */}
            <div className="flex gap-3">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
            </div>
        </div>
    );
}

export default CourseContent;