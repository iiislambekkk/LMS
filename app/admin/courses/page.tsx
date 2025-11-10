import React, {Suspense} from 'react';
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {adminGetCourses} from "@/app/data/admin/admin-get-courses";
import {AdminCourseCard, AdminCourseCardSkeleton} from "@/app/admin/courses/_components/AdminCourseCard";
import EmptyState from "@/components/general/EmptyState";
import {Skeleton} from "@/components/ui/skeleton";

const CoursesPage = async () => {


    return (
        <>
            <div className={"flex items-center justify-between"}>
                <h1 className={"text-2xl font-bold"}>Your Courses</h1>

                <Link className={buttonVariants()} href={"/admin/courses/create"}>
                    Create Course
                </Link>

            </div>

            <Suspense fallback={AdminCourseCardSkeletonLayout()}>
                <RenderCourses />
            </Suspense>
        </>
    );
};

const AdminCourseCardSkeletonLayout = () => {
    return (
        <div className={"grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7"}>
            {Array.from({ length: 8 }).map((_, index) => (
                <AdminCourseCardSkeleton key={index} />
            ))}
        </div>
    )
}

async function RenderCourses() {
    const data = await adminGetCourses()

    return (
        <>
            {data.length === 0 && <EmptyState
                title={"No Courses found"}
                description={"Create a new course to get started"}
                buttonText={"Create Course"}
                href={"/admin/courses/create"}
            />}
            {data.length !== 0 && (
                <div className={"grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7"}>
                    {data.map((course) => (
                        <AdminCourseCard data={course} key={course.id} />
                    ))}
                </div>
            )}
        </>
    )
}

export default CoursesPage;