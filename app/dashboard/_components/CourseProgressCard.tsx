"use client"

import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import {PublicCourseType} from "@/app/data/course/getAllCourses";
import Image from "next/image";
import {generateS3Url} from "@/hooks/generateS3Url";
import Link from "next/link";
import {ArrowLeft, SchoolIcon, TimerIcon} from "lucide-react";
import {buttonVariants} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {EnrolledCoursesType} from "@/app/data/user/getEnrolledCourses";
import {useCourseProgress} from "@/hooks/useCourseProgress";
import {Progress} from "@/components/ui/progress";

interface IPublicCourseCardProps {
    data: EnrolledCoursesType
}

const CourseProgressCard = ({data} : IPublicCourseCardProps) => {
    const thumbnailUrl = generateS3Url(data.course.fileKey)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {totalLessons, completedLessons, progressPercentage} = useCourseProgress({courseData: data.course})

    return (
        <Card className={"group relative py-0 gap-0"}>
            <Badge className={"absolute top-2 right-2 z-10"}>
                {data.course.level}
            </Badge>

            <Image src={thumbnailUrl}
                   unoptimized
                   width={600} height={400}
                   alt={`${data.course.title} course thumbnail`}
                   className={"aspect-video rounded-t-xl w-full object-cover"}
            />

            <CardContent className={"p-4"}>
                <Link href={`/dashboard/${data.course.slug}`}
                      className={"font-medium text-lg line-clamp-2, hover:underline group-hover:text-primary"}
                >
                    {data.course.title}
                </Link>

                <p className={"line-clamp-2 text-sm text-muted-foreground leading-tight mt-2"}>{data.course.smallDescription}</p>

                <div className="space-y-4 mt-5">
                    <div className={"flex justify-start mb-1  text-sm"}>
                        <p>Progress:</p>
                        <p className={"font-medium"}>{progressPercentage}</p>
                    </div>

                    <Progress
                        value={progressPercentage}
                        className={"h-1.5"}
                    />

                    <p>{completedLessons} of {totalLessons} lessons completed</p>
                </div>

                <Link href={`/dashboard/${data.course.slug}`} className={buttonVariants({
                    className: "w-full mt-4"
                })}>
                    Learn More
                </Link>
            </CardContent>
        </Card>
    );
};


export default CourseProgressCard;