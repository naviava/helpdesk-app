import { serverClient } from "@/app/_trpc/server-client";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await serverClient.getUserProfile();
  if (!user || user.role !== "ADMIN") return redirect("/");

  return <>{children}</>;
}
