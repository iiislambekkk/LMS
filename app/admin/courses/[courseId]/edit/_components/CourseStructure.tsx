"use client"

import React, {useEffect, useState} from 'react';
import {DndContext, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors} from "@dnd-kit/core";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";

import {AdminCourseSingularType} from "@/app/data/admin/admin-get-course";
import SortableItem from './SortableItem';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {ChevronDown, ChevronRight, FileTextIcon, GripVertical, Trash2Icon, XIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {toast} from "sonner";
import {reorderChapters, reorderLessons} from "@/app/admin/courses/[courseId]/edit/actions";
import NewChapterModal from "@/app/admin/courses/[courseId]/edit/_components/NewChapterModal";
import NewLessonModal from "@/app/admin/courses/[courseId]/edit/_components/NewLessonModal";
import DeleteLessonModal from "@/app/admin/courses/[courseId]/edit/_components/DeleteLessonModal";
import DeleteChapterModal from "@/app/admin/courses/[courseId]/edit/_components/DeleteChapterModal";


interface ICourseStructureProps {
    data: AdminCourseSingularType
}

const CourseStructure = ({data} : ICourseStructureProps) => {

    const initialItems = data.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: true, // default chapters are open
        lessons: chapter.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position
        })),
    })) || []

    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems((prev) => {
            const updatedItems = data.chapters.map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                order: chapter.position,
                isOpen: prev.find(item => item.id === chapter.id)?.isOpen ?? true,
                lessons: chapter.lessons.map(lesson => ({
                    id: lesson.id,
                    title: lesson.title,
                    order: lesson.position
                })),
            })) || []

            return updatedItems;
        })
    }, [data]);

    function handleDragEnd(event) {
        const {active, over} = event;

        if (!over || active.id === over.id) {
            return;
        }

        const activeId = active.id as string
        const overId = over.id as string

        const activeType = active.data.current.type as "chapter" | "lesson";
        const overType = over.data.current.type as "chapter" | "lesson";
        console.log(active)

        const courseId = data.id

        if (activeType === "chapter") {
            let targetChapterId : string | null = null

            if (overType === "chapter") {
                targetChapterId = overId
            }
            else if (overType === "lesson") {
                targetChapterId = over.data.current?.chapterId ?? null
            }

            if (!targetChapterId) {
                toast.error("Chapter not found!");
                return;
            }

            const oldIndex = items.findIndex((item) => item.id === activeId)
            const newIndex = items.findIndex((item) => item.id === targetChapterId)

            if (oldIndex == -1 || newIndex == -1) {
                toast.error("Index error brat");
                return;
            }

            const reorderedLocalChapters = arrayMove(items,  oldIndex, newIndex);

            const updatedChaptersForState = reorderedLocalChapters.map((chapter, index) => ({
                ...chapter,
                order: index + 1
            }));

            const previousItems = [...items]

            setItems(updatedChaptersForState)

            if (courseId) {
                const chaptersToUpdate = updatedChaptersForState.map(lesson => ({
                    id: lesson.id,
                    position: lesson.order
                }))


                toast.promise(reorderChapters(courseId, chaptersToUpdate), {
                    loading: 'Reordering Chapters...',
                    success: (result) => {
                        if (result.status == "success") return result.message
                    },
                    error: () => {
                        setItems(previousItems)
                        return "Failed to reorder Chapters..."
                    }
                })
            }
        }

        if (activeType === "lesson") {
            let targetLessonId : string | null = null

            if (overType === "lesson") {
                targetLessonId = overId
            }

            if (!targetLessonId) {
                toast.error("Lesson not found!");
                return;
            }

            const chapterId = active.data.current.chapterId
            const chapter = items.find(chapter => chapter.id === chapterId);
            const chapterIndex = items.findIndex(chapter => chapter.id === chapterId);

            if (!chapter) {
                toast.error("Chapter undefined error brat");
                return;
            }

            const oldIndex = chapter?.lessons.findIndex((item) => item.id === activeId)
            const newIndex = chapter?.lessons.findIndex((item) => item.id === targetLessonId)

            if (oldIndex == -1 || newIndex == -1) {
                toast.error("Index error brat");
                return;
            }

            const reorderedLocalLessons = arrayMove(chapter.lessons,  oldIndex, newIndex);

            const updatedLessonsForState = reorderedLocalLessons.map((chapter, index) => {
                return {
                    ...chapter,
                    order: index + 1
                }
            });

            const previousItems = [...items]
            const newItems = [...items]

            newItems[chapterIndex] = {
                ...chapter,
                lessons: updatedLessonsForState
            }

            setItems(newItems)

            if (courseId) {
                const lessonsToUpdate = updatedLessonsForState.map(lesson => ({
                    id: lesson.id,
                    position: lesson.order
                }))


                toast.promise(reorderLessons(chapterId, lessonsToUpdate, courseId), {
                    loading: 'Reordering Lessons...',
                    success: (result) => {
                        if (result.status == "success") return result.message
                    },
                    error: () => {
                        setItems(previousItems)
                        return "Failed to reorder Lessons..."
                    }
                })
            }
        }

    }

    const toggleChapter = (chapterId: string) => {
        setItems((prev) => {
            return prev
                .map((item, index) => item.id == chapterId ? {...item, isOpen: !item.isOpen } : item);
        })
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
            <Card>
                <CardHeader className={"flex flex-row items-center justify-between border-b border-border"}>
                    <CardTitle>Chapters</CardTitle>
                    <NewChapterModal courseId={data.id} />
                </CardHeader>

                <CardContent>
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className={"flex flex-col gap-4"}>
                            {items.map((item) => (
                                <SortableItem
                                    id={item.id}
                                    key={item.id}
                                    data={{
                                        type: "chapter"
                                    }}
                                    className={""}
                                >
                                    {
                                        (listeners) => (
                                            <Card>
                                                <Collapsible
                                                    open={item.isOpen}
                                                    onOpenChange={(open) => toggleChapter(item.id)}
                                                >
                                                    <div className={"flex items-center justify-between p-3 border-b border-border"}>
                                                        <div className={"flex items-center gap-2"}>
                                                            <Button
                                                                variant={"ghost"}
                                                                className={"cursor-grab opacity-60 hover:opacity-100"}
                                                                {...listeners}
                                                            >
                                                                <GripVertical className={"size-4"}/>
                                                            </Button>

                                                            <CollapsibleTrigger asChild>
                                                                <Button
                                                                    variant={"ghost"}
                                                                    className={"flex items-center gap-3"}
                                                                >
                                                                    {item.isOpen && (
                                                                        <ChevronDown className={"size-4"}/>
                                                                    )}

                                                                    {!item.isOpen && (
                                                                        <ChevronRight className={"size-4"}/>
                                                                    )}

                                                                    <p className={"cursor-pointer hover:text-primary"}>
                                                                        {item.title}
                                                                    </p>
                                                                </Button>
                                                            </CollapsibleTrigger>

                                                        </div>

                                                        <DeleteChapterModal chapterId={item.id} courseId={data.id}/>
                                                    </div>

                                                    <CollapsibleContent>
                                                        <div>
                                                            <SortableContext
                                                                items={item.lessons}
                                                                strategy={verticalListSortingStrategy}
                                                            >
                                                                {
                                                                    item.lessons.map((lesson, idx) => (
                                                                        <SortableItem
                                                                            data={{
                                                                                type: "lesson",
                                                                                chapterId: item.id
                                                                            }}
                                                                            id={lesson.id}
                                                                            key={lesson.id}
                                                                        >
                                                                            {(lessonListeners) => (
                                                                                <div className={"flex items-center justify-between p-3 border-b border-border hover:bg-primary/10 dark:hover:bg-background/40"}>
                                                                                    <div className={"flex items-center gap-2"}>
                                                                                        <Button
                                                                                            variant={"ghost"}
                                                                                            className={"cursor-grab opacity-60 hover:opacity-100"}
                                                                                            {...lessonListeners}
                                                                                        >
                                                                                            <GripVertical className={"size-4"}/>
                                                                                        </Button>

                                                                                        <FileTextIcon className={"size-4"}/>

                                                                                        <Link href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}>
                                                                                            <p className={"cursor-pointer hover:text-primary"}>
                                                                                                {lesson.title}
                                                                                            </p>
                                                                                        </Link>

                                                                                    </div>

                                                                                    <DeleteLessonModal courseId={data.id} chapterId={item.id} lessonId={lesson.id} />
                                                                                </div>
                                                                            )}
                                                                        </SortableItem>
                                                                    ))
                                                                }
                                                            </SortableContext>

                                                            <div className={"p-2"}>
                                                                <NewLessonModal courseId={data.id} chapterId={item.id} />
                                                            </div>
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </Card>
                                        )
                                    }
                                </SortableItem>
                            ))}
                        </div>
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    );
};

export default CourseStructure;