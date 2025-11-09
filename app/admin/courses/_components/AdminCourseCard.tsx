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

interface IAdminCourseCardProps {
    data: AdminCourseType;
}

export function AdminCourseCard({data}: IAdminCourseCardProps) {
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
                        <Link href={`/admin/courses/${data.id}/preview`} >
                            <TrashIcon className={"size-4 mr-2"} />
                            Delete
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <Image
            src={env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL + "/" + data.fileKey}
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