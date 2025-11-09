"use client"

import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";

export function useSignOut() {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                    toast.success("Logout successfully")
                },
            },
        });
    }

    return handleSignOut;
}