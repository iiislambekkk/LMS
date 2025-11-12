import {SectionCards} from "@/components/sidebar/section-cards";
import {ChartAreaInteractive} from "@/components/sidebar/chart-area-interactive";
import React, {Suspense} from "react";
import {requireAdmin} from "@/app/data/admin/require-user";
import {adminGetEnrollmentsStats} from "@/app/data/admin/admin-get-enrollments-stats";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {getRecentCourses} from "@/app/data/admin/adminGetRecentCourses";
import EmptyState from "@/components/general/EmptyState";
import {AdminCourseCard} from "@/app/admin/courses/_components/AdminCourseCard";
import {Skeleton} from "@/components/ui/skeleton";

export default async function Page() {
  const session = requireAdmin()
    const charData = await adminGetEnrollmentsStats()

  return (
      <>
          <SectionCards />
          <ChartAreaInteractive data={charData} />

          <div className={"space-y-4"}>
              <div className={"flex items-center justify-between"}>
                  <h2 className={"text-xl font-semibold"}>Recent Courses</h2>
                  <Link
                      className={buttonVariants({
                          variant: "outline"
                      })}
                      href={"/admin/courses"}>
                      View All Courses
                  </Link>
              </div>

                <Suspense fallback={RecentCoursesSkeleton()}>
                    <RenderRecentCourses/>
                </Suspense>
          </div>
      </>
  )
}

async function  RenderRecentCourses() {
    const data = await getRecentCourses()

    if (data.length === 0) {
        return (
            <EmptyState
                buttonText={"Create new Course"}
                description={"You dont have any courses. Craete some to see them here"}
                title={"You dont have any courses."}
                href={"/admin/courses/create"}
            />
        )
    }

    return (
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-6"}>
            {data.map((course) => (
                <AdminCourseCard data={course} key={course.id} />
            ))}
        </div>
    )
}

const RecentCoursesSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, idx) => (
                <div key={idx} className="p-4 border rounded-lg shadow-sm">
                    <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
                    <Skeleton className="h-4 w-1/2 mb-4" /> {/* Subtitle */}
                    <Skeleton className="h-32 w-full mb-4" /> {/* Image / content */}
                    <div className="flex space-x-2">
                        <Skeleton className="h-8 w-20 rounded" /> {/* Button 1 */}
                        <Skeleton className="h-8 w-20 rounded" /> {/* Button 2 */}
                    </div>
                </div>
            ))}
        </div>
    );
};