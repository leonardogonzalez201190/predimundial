import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignInGoogle({ event }: { event: number }) {
    return (
        <Button
            type="button"
            variant="outline"
            onClick={() => {
                document.cookie = `event=${event}; path=/; max-age=300`; // 5 min
                signIn("google", { callbackUrl: "/home" })
            }}>
            <div className="ant-image" style={{ width: 16, height: 16 }}>
                <img alt="Google" className="ant-image-img" src="/google-logo.png" />
            </div>
            Sign in with Google
        </Button>
    )
}