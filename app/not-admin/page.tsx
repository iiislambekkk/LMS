import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft, ShieldX} from "lucide-react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

const Page = () => {
    return (
        <div className={"min-h-screen flex items-center justify-center"}>
            <Card className={"max-w-md w-full"}>
                <CardHeader className={"text-center"}>
                    <div className={"bg-destructive/10 rounded-full p-4 w-fit mx-auto"}>
                        <ShieldX className={"size-16 text-destructive"} />
                    </div>
                    <CardTitle className={"text-2xl"}>
                        Access restricted
                    </CardTitle>
                    <CardDescription className={""}>
                        You are not an admin, which means you can't create any courses or stuff like that...
                    </CardDescription>
                </CardHeader>
                <CardContent className={"mx-auto max-w-md w-full"}>
                    <Link href={"/"} className={buttonVariants({
                        className: "w-full"
                    })}>
                        <ArrowLeft/>
                       Back to Home
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;