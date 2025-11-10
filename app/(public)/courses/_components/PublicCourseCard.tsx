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

interface IPublicCourseCardProps {
    data: PublicCourseType
}

const PublicCourseCard = ({data} : IPublicCourseCardProps) => {
    const thumbnailUrl = generateS3Url(data.fileKey)

    return (
        <Card className={"group relative py-0 gap-0"}>
            <Badge className={"absolute top-2 right-2 z-10"}>
                {data.level}
            </Badge>
            
            <Image src={thumbnailUrl}
                   unoptimized
                   width={600} height={400}
                   alt={`${data.title} course thumbnail`}
                   className={"aspect-video rounded-t-xl w-full object-cover"}
            />

            <CardContent className={"p-4"}>
                <Link href={`/courses/${data.slug}`}
                      className={"font-medium text-lg line-clamp-2, hover:underline group-hover:text-primary"}
                >
                    {data.title}
                </Link>

                <p className={"line-clamp-2 text-sm text-muted-foreground leading-tight mt-2"}>{data.smallDescription}</p>

                <div className="mt-4 flex items-center gap-x-5">
                    <div className={"flex items-center gap-x-2"}>
                        <TimerIcon className="size-7 p-1 rounded-md text-primary bg-blue-100 dark:bg-accent" />
                        <p className={"text-sm text-muted-foreground"}>{data.duration}h</p>
                    </div>

                    <div className={"flex items-center gap-x-2"}>
                        <SchoolIcon className="size-7 p-1 rounded-md text-primary bg-blue-100 dark:bg-accent" />
                        <p className={"text-sm text-muted-foreground"}>{data.level}</p>
                    </div>
                </div>

                <Link href={`/courses/${data.slug}`} className={buttonVariants({
                    className: "w-full mt-4"
                })}>
                    Learn More
                </Link>
            </CardContent>
        </Card>
    );
};


export const PublicCourseCardSkeleton = () => {
    return (
        <Card className="group relative py-0 gap-0">
            {/* Level badge placeholder */}
            <div className="absolute top-2 right-2 z-10">
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Thumbnail */}
            <div className={"relative h-fit w-full"}>
                <Skeleton
                    className="w-full aspect-video rounded-t-xl  rounded-t-xl"
                />
            </div>


            <CardContent className="p-4">
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />

                {/* Small description */}
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-5/6 mt-2" />

                {/* Meta rows */}
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-7 p-1 rounded-md" />
                        <Skeleton className="h-4 w-10" />
                    </div>

                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-7 p-1 rounded-md" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Button */}
                <Skeleton className="w-full h-10 mt-4" />
            </CardContent>
        </Card>
    );
};

export default PublicCourseCard;