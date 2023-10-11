import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AuthButton from "@/components/auth/auth-button";
import { serverClient } from "@/app/_trpc/server-client";

interface AgentPageProps {}

export default async function AgentPage({}: AgentPageProps) {
  return <div>AgentPage</div>;
}
