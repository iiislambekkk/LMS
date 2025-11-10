import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {AdminCourseType} from "@/app/data/admin/admin-get-courses";
import {env} from "@/lib/env";
import Link from "next/link";
import {ArrowLeft, EyeIcon, MoreVertical, PencilIcon, SchoolIcon, TimerIcon, TrashIcon} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";
import {generateS3Url} from "@/hooks/generateS3Url";

interface IAdminCourseCardProps {
    data: AdminCourseType;
}

export function AdminCourseCard({data}: IAdminCourseCardProps) {
    const thumbnailUrl = generateS3Url(data.fileKey)

    return (
    <Card className="group relative pt-0 gap-0">
        <div className={"absolute top-2 right-2 z-10"}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"secondary"} size="icon">
                        <MoreVertical className={"size-4"}/>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align={"end"} className={"w-48"}>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/courses/${data.id}/edit`} >
                            <PencilIcon className={"size-4 mr-2"} />
                            Edit course
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={`/admin/courses/${data.id}/preview`} >
                            <EyeIcon className={"size-4 mr-2"} />
                            Preview
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                        <Link href={`/admin/courses/${data.id}/delete`} >
                            <TrashIcon className={"size-4 mr-2"} />
                            Delete
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <Image
            src={thumbnailUrl}
            alt={`${data.title} course thumbnail`}
            className={"w-full rounded-t-lg aspect-video h-full object-cover"}
            width={1920} height={1080}
            unoptimized
        />

        <CardContent className={"mt-6"}>
            <Link href={`/admin/courses/${data.id}`}
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

            <Link href={`/admin/courses/${data.id}/edit`} className={buttonVariants({
                className: "w-full mt-4"
            })}>
                Edit course <ArrowLeft className={"size-4"} />
            </Link>
        </CardContent>
    </Card>
)}

export const AdminCourseCardSkeleton = () => {
    return (
        <Card className="group relative pt-0 gap-0">
            <div className={"absolute top-2 right-2 z-10"}>
                <Skeleton className={"h-6 w-16 rounded-full"} />
                <Skeleton className={"size-8 rounded-md"} />
            </div>
            <div className={"w-full relative h-fit"}>
                <Skeleton className={"w-full rounded-t-lg aspect-video h-[250px] object-cover"} />
            </div>
            <CardContent className={"mt-6"}>
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />

                {/* Small description */}
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-5/6 mt-2" />

                {/* Meta rows */}
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-7 rounded-md" />
                        <Skeleton className="h-4 w-10" />
                    </div>

                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-7 rounded-md" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Edit button */}
                <Skeleton className="w-full h-10 mt-4" />
            </CardContent>
        </Card>

    )
}