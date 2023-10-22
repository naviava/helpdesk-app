import { serverClient } from "@/app/_trpc/server-client";

interface CaseIdPageProps {
  params: { caseId: string };
}

export default async function CaseIdPage({ params }: CaseIdPageProps) {
  const ticket = await serverClient.ticket.getTicketById({ id: params.caseId });

  return (
    <ul className="p-6">
      {ticket.messages.map((message) =>
        message.attachments.map((url) => <li key={url.id}>{url.name}</li>),
      )}
    </ul>
  );
}
