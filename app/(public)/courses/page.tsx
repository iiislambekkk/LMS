import React, {Suspense} from 'react';
import {getAllCourses} from "@/app/data/course/getAllCourses";
import PublicCourseCard, {PublicCourseCardSkeleton} from "@/app/(public)/courses/_components/PublicCourseCard";
import {AdminCourseCardSkeleton} from "@/app/admin/courses/_components/AdminCourseCard";

const PublicCoursesPage = () => {
    return (
        <div className={"mt-5"}>
              <div className={"flex flex-col space-y-2 mb-10"}>
                  <h1 className={"text-3xl md:text-4xl font-bold"}>Explore Courses</h1>
                  <p>Discover our wide range of courses designed to gelp you achieve your learning goals.</p>
              </div>


            <Suspense fallback={PublicCourseCarsdSkeletonLayout()}>
                <RenderCourses />
            </Suspense>
        </div>
    );
};

const PublicCourseCarsdSkeletonLayout = () => {
    return (
        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
            {Array.from({ length: 8 }).map((_, index) => (
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    )
}


async function RenderCourses() {
    const courses = await getAllCourses()

    return (
        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
            {courses.map((course) => {
                return (
                    <PublicCourseCard data={course} key={course.id} />
                )
            })}
        </div>
    )
}


export default PublicCoursesPage;