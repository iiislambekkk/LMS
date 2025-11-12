import React from 'react';
import CourseSidebar from "@/app/dashboard/[slug]/_components/CourseSidebar";
import {CoursSidebarDataType, getCourseSidebarData} from "@/app/data/course/get-course-sidebar-data";

const Layout = async ({children, params} : {children: React.ReactNode, params: {slug: string}}) => {
    const {slug} = await params
    const sidebarData : CoursSidebarDataType = await getCourseSidebarData(slug)

    return (
        <div className={"flex flex-1"}>
            <div className={"w-80 border-r border-border shrink-0"}>
                <CourseSidebar course={sidebarData.course} />
            </div>

            <div className={"flex-1 overflow-hidden"}>
                {children}
            </div>
        </div>
    );
};

export default Layout;