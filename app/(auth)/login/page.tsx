import LoginForm from "@/app/(auth)/login/_components/LoginForm";
import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

const LoginPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        return redirect("/")
    }

    return <LoginForm />;
};

export default LoginPage;