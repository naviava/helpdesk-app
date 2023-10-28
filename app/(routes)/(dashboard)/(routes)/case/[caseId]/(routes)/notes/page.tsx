import { redirect } from "next/navigation";

import TechNoteInput from "./_components/tech-note-input";
import TechNotesArea from "./_components/tech-notes-area";

import { serverClient } from "@/app/_trpc/server-client";

interface TechNotesPageProps {
  params: { caseId: string };
}

export default async function TechNotesPage({ params }: TechNotesPageProps) {
  const ticket = await serverClient.ticket.getTicketById({ id: params.caseId });
  if (!ticket) return redirect("/");

  return (
    <>
      <TechNoteInput />
      {ticket.technicalNotes.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center">
          No notes yet.
        </div>
      )}
      {ticket.technicalNotes.length > 0 && <TechNotesArea ticket={ticket} />}
    </>
  );
}
