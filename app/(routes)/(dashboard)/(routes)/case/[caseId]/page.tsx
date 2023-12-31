import { redirect } from "next/navigation";

import MessageInput from "./_components/message-input";

import { serverClient } from "@/app/_trpc/server-client";
import MessagesArea from "./_components/messages-area";

interface CaseIdPageProps {
  params: { caseId: string };
}

export default async function CaseIdPage({ params }: CaseIdPageProps) {
  const ticket = await serverClient.ticket.getTicketById({ id: params.caseId });
  if (!ticket) return redirect("/");

  return (
    <>
      <MessageInput />
      {ticket.messages.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center">
          No messages yet.
        </div>
      )}
      {ticket.messages.length > 0 && <MessagesArea ticket={ticket} />}
    </>
  );
}
