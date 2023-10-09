import AuthButton from "@/components/auth/auth-button";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface AgentPageProps {}

export default async function AgentPage({}: AgentPageProps) {
  const session = await getServerSession();
  if (!session || !session.user?.email) return redirect("/");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return redirect("/");
  if (user.role === "USER" || user.role === "MANAGER") return redirect("/user");

  return (
    <div>
      <AuthButton />
    </div>
  );
}
