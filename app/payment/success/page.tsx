"use client"

import React, {useEffect} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {CheckIcon} from "lucide-react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {useConfetti} from "@/hooks/useConfetti";

const Page = () => {
    const {triggerConfetti} = useConfetti()

    useEffect(() => {
        triggerConfetti()
    }, [triggerConfetti]);

    return (
        <div className={"w-full min-h-screen flex flex-1 justify-center items-center"}>
            <Card className={"w-[350px]"}>
                <CardContent>
                    <div className={"w-full flex justify-center"}>
                        <CheckIcon className={"size-12 p-2 bg-green-500/30 text-green-500 rounded-full "}/>
                    </div>
                    <div className={"mt-3 text-center sm:mt-5 w-full"}>
                        <h2 className={"text-xl font-semibold"}>Payment successful</h2>
                        <p className={"text-sm text-muted-foreground tracking-tight text-balance"}>
                          Congrats your payment was successful.
                        </p>


                        <Link href={"/dashboard"} className={buttonVariants({
                            className: "w-full mt-5 bg-green-500/50! hover:bg-green-500/70!",
                        })}>
                            Go to Dashboard
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;