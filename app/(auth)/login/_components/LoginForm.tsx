"use client"

import React, {useState, useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {GithubIcon, Loader2Icon, LoaderIcon, SendIcon} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const LoginForm = () => {
    const router = useRouter();

    const [githubPending, startGithubTransition] = useTransition()
    const [emailPending, startEmailPending] = useTransition()

    const [email, setEmail] = useState<string>("");

    const signInWithGithub = async () => {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed in with Github, you will be redirected")
                    },
                    onError: (e) => {
                        toast.error("Interval server error")
                    }
                }
            })
        })
    }

    const signInWithEmail = () => {
        startEmailPending(async () => {
           await authClient.emailOtp.sendVerificationOtp({
               email: email,
               type: "sign-in",
               fetchOptions: {
                   onSuccess: () => {
                       toast.success("Email sent")
                       router.push(`/verify-request?email=${email}`)
                   },
                   onError: (e) => {
                       toast.error("Error sending email")
                   }
               }
           })
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome back !</CardTitle>
                <CardDescription>Login with your Github Email Account</CardDescription>
            </CardHeader>

            <CardContent className={"flex flex-col gap-4"}>
                <Button
                    disabled={githubPending}
                    onClick={signInWithGithub}
                    className={"w-full"}
                    variant={"outline"}
                >
                    {githubPending && <LoaderIcon className={"size-4 animate-spin"}/>}
                    {!githubPending && <GithubIcon className={"size-4"}/>}

                    Sign in with Github
                </Button>

                <div className={"relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"}>
                    <span className={"relative z-10 bg-card px-2 text-muted-foreground"}>Or continue with</span>
                </div>

                <div className={"grid gap-3"}>
                    <div className={"grid gap-2"}>
                        <Label htmlFor={"email"}>
                            Email
                        </Label>
                        <Input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            type={"email"}
                            placeholder={"email@example.com"} />
                    </div>

                    <Button onClick={signInWithEmail} disabled={emailPending}>
                        {emailPending && (
                            <>
                                <Loader2Icon className={"size-4 animate-spin"}/>
                                <span>Loading...</span>
                            </>
                        )}

                        {!emailPending && (
                            <>
                                <SendIcon className={"size-4"}/>
                                <p>Continue with Email</p>
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LoginForm;