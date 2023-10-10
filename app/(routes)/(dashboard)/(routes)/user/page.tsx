import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AuthButton from "@/components/auth/auth-button";
import { serverClient } from "@/app/_trpc/server-client";

interface UserPageProps {}

export default async function UserPage({}: UserPageProps) {
  const session = await getServerSession();
  if (!session) return redirect("/");

  const user = await serverClient.getUserProfile();
  if (!user) return redirect("/");

  return (
    <div className="p-6">
      <AuthButton initialData={user} />
    </div>
  );
}
