"use client"

import React, {useState, useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {GithubIcon, Loader2Icon, LoaderIcon, SendIcon} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter, useSearchParams} from "next/navigation";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {email} from "zod";

const VerifyRequestPage = () => {
    const router = useRouter();

    const [otp, setOtp] = useState<string>("");
    const [emailPending, startEmailPending] = useTransition()
    const queryParams = useSearchParams()
    const email = queryParams.get("email") as string
    const isOtpCompleted = otp.length === 6


    const verifyOtp = () => {
        startEmailPending(async () => {
                await authClient.signIn.emailOtp({
                    email,
                    otp,
                    fetchOptions: {
                        onSuccess: () => {
                            toast.success("Email verified")
                            router.push(`/`)
                        },
                        onError: (e) => {
                            toast.error("Error verifying Email/OTP")
                        }
                    }
                })
            }
        )
    }

    return (
        <Card className={"w-full mx-auto"}>
            <CardHeader className={"text-center"}>
                <CardTitle className={"text-xl"}>Please check your email</CardTitle>
                <CardDescription>
                    We have sent a vervifcation email code to your email addres.
                    Please open the email and paste the code below.
                </CardDescription>
            </CardHeader>

            <CardContent className={"space-y-6"}>
                <div className={"flex flex-col items-center space-y-2"}>
                    <InputOTP
                        value={otp}
                        onChange={value => setOtp(value)}
                        maxLength={6}
                        className={"gap-2"}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <p className={"text-sm text-muted-foreground"}>Enter the 6 digit code sent to your email</p>
                </div>

                <Button
                    onClick={verifyOtp}
                    disabled={emailPending || !isOtpCompleted}
                    className={"w-full"}
                >
                    {emailPending && <LoaderIcon className={"size-4 animate-spin"}/>}
                    {!emailPending && <p>Verify Account</p>}
                </Button>
            </CardContent>
        </Card>
    );
};

export default VerifyRequestPage;