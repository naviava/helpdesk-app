import { serverClient } from "@/app/_trpc/server-client";

interface CaseIdPageProps {
  params: { caseId: string };
}

export default async function CaseIdPage({ params }: CaseIdPageProps) {
  const ticket = await serverClient.ticket.getTicketById({ id: params.caseId });

  return <div>{ticket.title}</div>;
}
