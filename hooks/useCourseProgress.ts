import {useMemo} from "react";
import {CoursSidebarDataType} from "@/app/data/course/get-course-sidebar-data";

export function useCourseProgress({courseData}: {courseData: CoursSidebarDataType["course"]}) {
    return useMemo(() => {
        let totalLessons = 0;
        let completedLessons = 0;

        courseData.chapters.forEach((chapter) => {
            chapter.lessons.forEach((lesson) => {
                totalLessons++

                const isCompleted = lesson.lessonProgress.some(
                    lessonProgress => lessonProgress.lessonId === lesson.id && lessonProgress.completed
                )
                
                if (isCompleted) {
                    completedLessons++;
                }
            })
        })

        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

        return {
            totalLessons,
            completedLessons,
            progressPercentage
        }
    }, [courseData.chapters])
}