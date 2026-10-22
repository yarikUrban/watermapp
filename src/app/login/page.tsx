"use client";
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function LoginPage() {
  const [view, setView] = useState<"login" | "register">("login");

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-12">
      <div className="w-full max-w-md">
        {view === "login" ? (
          <LoginForm onRegisterClick={() => setView("register")} />
        ) : (
          <RegisterForm onLoginClick={() => setView("login")} />
        )}
      </div>
    </main>
  );
}
