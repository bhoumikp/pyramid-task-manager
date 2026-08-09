import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <LoginForm />
    </main>
  );
}