import React from 'react';
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {adminGetCourses} from "@/app/data/admin/admin-get-courses";
import {AdminCourseCard} from "@/app/admin/courses/_components/AdminCourseCard";

const CoursesPage = async () => {
    const data = await adminGetCourses()


    return (
        <>
            <div className={"flex items-center justify-between"}>
                <h1 className={"text-2xl font-bold"}>Your Courses</h1>

                <Link className={buttonVariants()} href={"/admin/courses/create"}>
                    Create Course
                </Link>

            </div>

            <div className={"grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7"}>
                {data.map((course) => (
                    <AdminCourseCard data={course} key={course.id} />
                ))}
            </div>
        </>
    );
};

export default CoursesPage;