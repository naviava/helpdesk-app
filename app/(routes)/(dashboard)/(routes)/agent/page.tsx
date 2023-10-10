import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AuthButton from "@/components/auth/auth-button";
import { serverClient } from "@/app/_trpc/server-client";

interface AgentPageProps {}

export default async function AgentPage({}: AgentPageProps) {
  const session = await getServerSession();
  if (!session || !session.user?.email) return redirect("/");

  const user = await serverClient.getUserProfile();

  if (!user) return redirect("/");
  if (user.role === "USER" || user.role === "MANAGER") return redirect("/user");

  return (
    <div>
      <AuthButton initialData={user} />
    </div>
  );
}
