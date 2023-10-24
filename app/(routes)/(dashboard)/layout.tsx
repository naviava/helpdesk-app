import { redirect } from "next/navigation";
import { serverClient } from "@/app/_trpc/server-client";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await serverClient.user.getUserProfile();
  if (!user) return redirect("/");

  if (!user.empId) {
    await serverClient.user.createEmployeeId();
  }

  return <>{children}</>;
}
