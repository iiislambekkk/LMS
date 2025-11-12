import React, {Suspense} from 'react';
import {getLessonContent} from "@/app/data/course/getLessonContent";
import CourseContent, {LessonContentSkeleton} from "@/app/dashboard/[slug]/[lessonId]/_components/CourseContent";

const Page = async ({params} : {params: {lessonId: string}}) => {
    const {lessonId} = await params

    return (
        <Suspense fallback={<LessonContentSkeleton/>}>
            {LessonContentLoader(lessonId)}
        </Suspense>
    )
};

async function LessonContentLoader(lessonId : string) {
    const data = await getLessonContent(lessonId)

    return (
        <CourseContent lesson={data} />
    )
}

export default Page;