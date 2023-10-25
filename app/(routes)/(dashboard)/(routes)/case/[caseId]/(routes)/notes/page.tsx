import { redirect } from "next/navigation";
import { serverClient } from "@/app/_trpc/server-client";

interface NotesPageProps {
  params: { caseId: string };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const ticket = await serverClient.ticket.getTicketById({ id: params.caseId });
  if (!ticket) return redirect("/");

  return <div>NotesPage</div>;
}
