import { redirect } from "next/navigation";
import { serverClient } from "@/app/_trpc/server-client";

interface AgentLayoutProps {
  children: React.ReactNode;
}

export default async function AgentLayout({ children }: AgentLayoutProps) {
  const user = await serverClient.user.getUserProfile();
  if (!user || user.role === "MANAGER" || user.role === "USER")
    return redirect("/user");

  return <>{children}</>;
}
