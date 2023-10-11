import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AuthButton from "@/components/auth/auth-button";
import { serverClient } from "@/app/_trpc/server-client";

interface UserPageProps {}

export default async function UserPage({}: UserPageProps) {
  const user = await serverClient.getUserProfile();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold">Welcome back, {user?.name}</h1>
    </div>
  );
}
