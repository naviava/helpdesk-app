import Link from "next/link";

import { ShieldCheck } from "lucide-react";

import IconBadge from "@/components/icon-badge";
import AuthButton from "@/components/auth/auth-button";
import NavigationLinks from "./navigation-links";
import MobileSidebar from "./mobile-sidebar";

import { serverClient } from "@/app/_trpc/server-client";
import Logo from "@/components/logo";

export default async function Navbar() {
  const user = await serverClient.user.getUserProfile();
  const isHelpdesk = user?.role === "ADMIN" || user?.role === "AGENT";

  return (
    <nav className="relative flex h-full items-center justify-between border-b bg-slate-100 p-4 shadow-sm">
      <div className="hidden lg:block">
        <Logo />
      </div>
      <MobileSidebar />
      <NavigationLinks isHelpdesk={isHelpdesk} />
      {/* Auth Routes. */}
      <div className="flex items-center gap-x-4">
        {/* Admin dashboard link. */}
        {user?.role === "ADMIN" && (
          <Link href="/admin">
            <IconBadge icon={ShieldCheck} size="lg" />
          </Link>
        )}
        <AuthButton initialData={user} />
      </div>
    </nav>
  );
}
