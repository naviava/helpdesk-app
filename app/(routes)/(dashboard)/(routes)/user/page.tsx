import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AuthButton from "@/components/auth/auth-button";

interface UserPageProps {}

export default async function UserPage({}: UserPageProps) {
  const session = await getServerSession();
  if (!session) return redirect("/");

  return (
    <div>
      <AuthButton />
    </div>
  );
}
