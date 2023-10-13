import { redirect } from "next/navigation";
import { serverClient } from "@/app/_trpc/server-client";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await serverClient.getUserProfile();
  if (!user) return redirect("/");

  if (user.disabled) {
    signOut();
    toast.error("User account is disabled");
  }

  return <>{children}</>;
}
