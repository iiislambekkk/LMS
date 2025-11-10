import React from 'react';
import {adminGetLesson} from "@/app/data/admin/admin-get-lesson";
import LessonForm from "@/app/admin/courses/[courseId]/[chapterId]/[lessonId]/_components/LessonForm";

type Params = {
    courseId: string,
    chapterId: string
    lessonId: string
}

const LessonIdPage = async ({params} : {params: Params}) => {
    const {courseId, chapterId, lessonId} = await params

    const data = await adminGetLesson(lessonId)

    return (
        <div>
            <LessonForm data={data} chapterId={chapterId} courseId={courseId} />
        </div>
    );
};

export default LessonIdPage;