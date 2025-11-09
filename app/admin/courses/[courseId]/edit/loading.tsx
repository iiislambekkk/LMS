import React from 'react';
import {Loader2} from "lucide-react";

const Loading = () => {
    return (
        <div className={"flex justify-center items-center w-full mt-5 flex-col gap-2"}>
            <Loader2 className={"size-10 animate-spin"}/>
            <p className={"text-3xl"}>Loading</p>
        </div>
    );
};

export default Loading;