import { redirect } from "next/navigation";
import AgentSelector from "./_components/agent-selector";
import { serverClient } from "@/app/_trpc/server-client";

interface TicketOptionsPageProps {}

export default async function TicketOptionsPage({}: TicketOptionsPageProps) {
  const user = await serverClient.user.getUserProfile();
  if (!user) return redirect("/");

  return (
    <article className="mx-auto max-w-xl space-y-10">
      <AgentSelector />
      <p className="text-center text-sm italic text-muted-foreground">
        If you want to see more features, contact me on Twitter -{" "}
        <a
          href="https://twitter.com/oldmannav"
          target="_blank"
          className="text-indigo-500 transition-all hover:underline"
        >
          @oldmannav
        </a>
      </p>
    </article>
  );
}
