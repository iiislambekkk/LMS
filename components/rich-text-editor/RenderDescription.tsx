"use client"
import React, {useMemo} from 'react';
import {type JSONContent} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser"
import {generateHTML} from "@tiptap/html"
import {cn} from "@/lib/utils";

const RenderDescription = ({json} : {json: JSONContent}) => {
    const output = useMemo(() => {
        return generateHTML(json, [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            })
        ])
    }, [json])

    return (
        <div className={cn(
            "rounded-lg min-h-[300px] p-4 border border-input focus:outline-none w-full",
            "dark:bg-input/30 shadow-xs transition-[color,box-shadow]",
            "prose prose-sm lg:prose-lg xl:prose-xl dark:prose-invert !w-full max-w-full overflow-hidden break-all"
        )}>
            {parse(output)}
        </div>
    );
};

export default RenderDescription;