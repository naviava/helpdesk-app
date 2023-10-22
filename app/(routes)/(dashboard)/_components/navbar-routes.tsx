"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import AuthButton from "@/components/auth/auth-button";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

import { serverClient } from "@/app/_trpc/server-client";
import { ShieldCheck } from "lucide-react";
import IconBadge from "@/components/icon-badge";

interface NavbarRoutesProps {
  user: Awaited<ReturnType<(typeof serverClient)["user"]["getUserProfile"]>>;
}

export default function NavbarRoutes({ user }: NavbarRoutesProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-x-4">
      {user?.role === "ADMIN" && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin")}
        >
          <IconBadge icon={ShieldCheck} size="lg" />
        </Button>
      )}
      <AuthButton user={user} />
    </div>
  );
}
