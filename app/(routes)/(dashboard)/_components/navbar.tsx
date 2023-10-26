import Link from "next/link";

import { ShieldCheck } from "lucide-react";

import IconBadge from "@/components/icon-badge";
import AuthButton from "@/components/auth/auth-button";
import NavigationLinks from "./navigation-links";
import MobileSidebar from "./mobile-sidebar";

import { serverClient } from "@/app/_trpc/server-client";

export default async function Navbar() {
  const user = await serverClient.user.getUserProfile();

  return (
    <nav className="relative flex h-full items-center justify-between border-b bg-slate-100 p-4 shadow-sm dark:bg-slate-900">
      <h1 className="hidden text-2xl lg:block">LOGO</h1>
      <MobileSidebar />
      <NavigationLinks />
      {/* Auth Routes. */}
      <div className="flex items-center gap-x-4">
        {/* Admin dashboard link. */}
        {user?.role === "ADMIN" && (
          <Link href="/admin">
            <IconBadge icon={ShieldCheck} size="lg" />
          </Link>
        )}
        <AuthButton user={user} />
      </div>
    </nav>
  );
}
