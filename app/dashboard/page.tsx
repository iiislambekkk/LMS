import React from 'react';
import {getAllCourses} from "@/app/data/course/getAllCourses";
import {getEnrolledCourses} from "@/app/data/user/getEnrolledCourses";
import EmptyState from "@/components/general/EmptyState";
import {Course} from "@/lib/generated/prisma/client";
import PublicCourseCard from "@/app/(public)/courses/_components/PublicCourseCard";
import Link from "next/link";
import CourseProgressCard from "@/app/dashboard/_components/CourseProgressCard";

const DashBoardPage = async () => {
    const [courses, enrolledCourses] = await Promise.all([getAllCourses(), getEnrolledCourses()])

    /* eslint-disable @typescript-eslint/ban-ts-comment  */
    // @ts-ignore
    const availableCourses = courses.filter((course: Course) => !enrolledCourses.some(({course: enrolled}) => enrolled.id === course.id))

    return (
        <>
            <div className={"flex flex-col gap-2"}>
                <h1 className={"text-3xl font-bold"}>
                    Enrolled courses
                </h1>
                <p className={"text-muted-foreground"}>
                    Here you can see all the courses you have access to
                </p>
            </div>

            {enrolledCourses.length === 0 && (
                <EmptyState
                    title={"No courses purchased"}
                    description={"You havent purchased courses yet."}
                    buttonText={"Browse Courses"}
                    href={"/courses"}
                />
            )}

            {enrolledCourses.length != 0 && (
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 mt-5"}>
                    {enrolledCourses.map((course) => (
                        <CourseProgressCard data={course} key={course.id}/>
                    ))}
                </div>
            )}

            <section className={"mt-10"}>
                <div className={"flex flex-col gap-2"}>
                    <h1 className={"text-3xl font-bold"}>
                        Availabel courses
                    </h1>
                    <p className={"text-muted-foreground"}>
                        Here you can see all the courses you can purchase
                    </p>
                </div>

                {availableCourses.length === 0 ? (
                    <EmptyState
                        title={"No courses availabel"}
                        description={"You have already purchased all available courses."}
                        buttonText={"Browse Courses"}
                        href={"/courses"}
                    />
                )
                :
                (
                    <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 mt-5"}>
                        {availableCourses.map((course) => (
                           <PublicCourseCard key={course.id} data={course} />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
};

export default DashBoardPage;