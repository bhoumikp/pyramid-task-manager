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
            className="h-9 w-full rounded-4xl"
            onClick={handleGuestLogin}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Continue as Guest"}
          </Button>

          <Button variant="outline" className="h-9 w-full rounded-4xl">
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