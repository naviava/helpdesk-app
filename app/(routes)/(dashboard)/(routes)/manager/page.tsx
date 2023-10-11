import { serverClient } from "@/app/_trpc/server-client";
import AuthButton from "@/components/auth/auth-button";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface ManagerPageProps {}

export default async function ManagerPage({}: ManagerPageProps) {
  const session = await getServerSession();
  if (!session || !session.user?.email) return redirect("/");

  const user = await serverClient.getUserProfile();

  if (!user) return redirect("/");
  if (user.role === "USER") return redirect("/user");

  return (
    <div className="p-6">
      <AuthButton initialData={user} />
    </div>
  );
}
