import { redirect } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "./_components/message-input";
import MessageBox from "./_components/message-box";

import { serverClient } from "@/app/_trpc/server-client";

interface CaseIdPageProps {
  params: { caseId: string };
}

export default async function CaseIdPage({ params }: CaseIdPageProps) {
  const ticket = await serverClient.ticket.getTicketById({ id: params.caseId });
  if (!ticket) return redirect("/");

  return (
    <>
      {ticket.messages.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center">
          No messages yet.
        </div>
      )}
      {ticket.messages.length > 0 && (
        <ScrollArea className="flex h-[75vh] flex-col">
          {ticket.messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              ticketOwnerId={ticket.owner.id}
            />
          ))}
        </ScrollArea>
      )}
      <MessageInput />
      {/* Children ends here */}
    </>
  );
}
