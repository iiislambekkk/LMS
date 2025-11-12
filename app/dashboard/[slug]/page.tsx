import React from 'react';
import {getCourseSidebarData} from "@/app/data/course/get-course-sidebar-data";
import {redirect} from "next/navigation";

const Page = async ({params} : {params: {slug: string}}) => {
    const {slug} = await params

    const course = await getCourseSidebarData(slug)

    const firstChapter = course.course.chapters[0]
    const firstLesson = firstChapter.lessons[0]

    if (firstLesson) {
        redirect(`/dashboard/${slug}/${firstLesson.id}`)
    }

    return (
        <div className={"flex flex-col items-center justify-center h-fit text-center mt-32"}>
            <h2 className={"text-2xl font-bold mb-2"}>No lessons available</h2>
            <p className={"text-muted-foreground"}>This course does not have any lessons yet</p>
        </div>
    );
};

export default Page;