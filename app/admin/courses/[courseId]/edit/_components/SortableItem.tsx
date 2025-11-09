"use client"

import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import React from "react";
import {cn} from "@/lib/utils";
import {DraggableSyntheticListeners} from "@dnd-kit/core";

interface ISortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
    className?: string;
    data?: {
        type: "chapter" | "lesson";
        chapterId?: string;
    }
}

export default function SortableItem({id, children, className, data} : ISortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id, data});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef}
             style={style}
             {...attributes}
             className={cn("",
                 className,
                 isDragging && "z-10",
             )}
        >
            {children(listeners)}
        </div>
    );
}
