"use client"
import {ThemeToggle} from "@/components/ui/ThemeToggle";
import {authClient} from "@/lib/auth-client";
import {Button, buttonVariants} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

type featureProp = {
    title: string;
    description: string;
    icon: string;
}

const features: featureProp[] = [
    {
        title: "Comprehensive Courses",
        description: "Access a wide range of carefully curated courses designed by industry experts.",
        icon: "📚"
    },
    {
        title: "Interactive Learning",
        description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
        icon: "🎮"
    },
    {
        title: "Progress Traking",
        description: "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
        icon: "📊"
    },
    {
        title: "Community Support",
        description: "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
        icon: "🙎"
    }
]

export default  function Home() {

    return (
        <>

            <section className={"relative py-20"}>
                <div className={"flex flex-col items-center justify-center text-center space-y-8"}>
                    <Badge variant={"outline"}>
                        The Future of Online Education
                    </Badge>
                    <h1 className={"text-4xl md:text-6xl font-bold tracking-tight"}>Elevate your Learning Experience</h1>
                    <p className={"max-w-[700px] text-muted-foreground md:text-xl"}>
                        DDiscover a new way to learn with our modern, interactive learning management system.
                        Access high-quality courses anytime, anywhere.
                    </p>

                    <div className={"flex flex-col sm:flex-row gap-4 mt-8"}>
                        <Link
                            className={buttonVariants({
                                size: "lg"
                            })}
                            href="/"
                        >
                            Exlore Courses
                        </Link>

                        <Link
                            className={buttonVariants({
                                size: "lg",
                                variant: "outline"
                            })}
                            href="/login"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            <section className={"grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-4 mb-64"}>
                {features.map((feature, index) => (
                    <Card key={index} className={"hover:shadow-lg transition-shadow"}>
                        <CardHeader className={"flex flex-col gap-6"}>
                            <div className={"text-4xl"}>{feature.icon}</div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className={"text-muted-foreground"}>
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </>
    );
}
