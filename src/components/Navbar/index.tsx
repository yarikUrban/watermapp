"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { createClient } from "@/app/lib/client";

export default function Navbar() {
  const pathname = usePathname();
  const { user, clearUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (pathname !== "/" && pathname !== "/map") return null;

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await createClient().auth.signOut();
      if (!error) {
        clearUser();
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="map-header fixed z-[200]">
      <div className="flex h-10 w-full items-center justify-end gap-2 px-2">
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
                onClick={handleLogOut}
                disabled={isLoggingOut}
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
                  "h-8 w-fit gap-2 rounded-full px-3 text-xs font-medium text-[#385b49] hover:bg-white/60",
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





