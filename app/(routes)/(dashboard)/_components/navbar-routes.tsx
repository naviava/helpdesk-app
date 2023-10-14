"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import AuthButton from "@/components/auth/auth-button";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

import { serverClient } from "@/app/_trpc/server-client";
import { ShieldCheck } from "lucide-react";

interface NavbarRoutesProps {
  user: Awaited<ReturnType<(typeof serverClient)["getUserProfile"]>>;
}

export default function NavbarRoutes({ user }: NavbarRoutesProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-x-4">
      {user?.role === "ADMIN" && (
        <Button
          type="button"
          variant="link"
          size="icon"
          onClick={() => router.push("/admin")}
        >
          <ShieldCheck className="h-7 w-7 text-sky-400 dark:text-sky-700" />
        </Button>
      )}
      <AuthButton user={user} />
      <ThemeToggleButton />
    </div>
  );
}
