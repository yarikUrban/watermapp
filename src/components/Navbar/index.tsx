"use client";

import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { logOut } from "@/app/actions/auth";
import { Button, buttonVariants } from "../ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-[200] border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="flex w-full items-center justify-between h-14 gap-3 px-4 sm:px-6">
        <div></div>
        <div className="flex  items-center gap-4">
          {user ? (
            <>
              <span className="max-w-[240px] truncate text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Выйти"
                title="Выйти"
                className="size-9 rounded-full text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
                onClick={logOut}
              >
                <LogOut />
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                aria-label="Войти"
                title="Войти"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "w-fit flex gap-4 px-4 font-medium",
                )}
              >
                <span className="max-w-[240px] truncate text-sm text-muted-foreground">
                  Войти
                </span>
                <LogIn />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
