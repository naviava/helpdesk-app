import { redirect } from "next/navigation";
import { serverClient } from "@/app/_trpc/server-client";

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export default async function ManagerLayout({ children }: ManagerLayoutProps) {
  const user = await serverClient.getUserProfile();
  if (!user || user.role === "USER") return redirect("/user");

  return <>{children}</>;
}
