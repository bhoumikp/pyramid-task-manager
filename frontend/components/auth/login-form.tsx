"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PyramidLogo } from "../brand/pyramid-logo";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAsGuest } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleGuestLogin() {
    try {
      setIsLoading(true);

      await loginAsGuest();
      router.push("/");
    } catch (error) {
      console.error("Guest login failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleLogin() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    window.location.href = `${backendUrl}/auth/google`;
  }

  return (
    <div className="w-[384px] space-y-6">
      {/* Brand */}
      <div className="flex justify-center items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <PyramidLogo className="size-4" />
        </div>

        <h1 className="text-sm font-semibold tracking-tight">
          Pyramid
        </h1>
      </div>

      {/* Login card */}
      <Card className="border-border/60 rounded-4xl shadow-xs py-6 space-y-2">
        <CardHeader className="text-center gap-1.5 px-6">
          <CardTitle className="text-xl">Let&apos;s get back on track</CardTitle>

          <CardDescription className="text-sm">
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 px-6">
          <Button
            className="h-9 w-full rounded-4xl cursor-pointer"
            onClick={handleGuestLogin}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Continue as Guest"}
          </Button>

          <Button
            variant="outline"
            className="h-9 w-full rounded-4xl cursor-pointer flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Login with Google
          </Button>
        </CardContent>
      </Card>

      {/* T&C Footer */}
      <div className="flex justify-center">
        <p className="w-48 text-center text-xs leading-5 text-muted-foreground">
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}