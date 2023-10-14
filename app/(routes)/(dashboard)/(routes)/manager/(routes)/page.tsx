import { serverClient } from "@/app/_trpc/server-client";
import AuthButton from "@/components/auth/auth-button";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface ManagerPageProps {}

export default async function ManagerPage({}: ManagerPageProps) {
  return redirect("/user");
}
