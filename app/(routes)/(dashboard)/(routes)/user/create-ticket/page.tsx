import PageHeading from "@/components/page-heading";
import CreateTicketForm from "./_components/create-ticket-form";

interface CreateTicketPageProps {}

export default function CreateTicketPage({}: CreateTicketPageProps) {
  return (
    <>
      <PageHeading
        title="Create New Ticket"
        tagline="Complete optional fields to expedite the process."
      />
      <CreateTicketForm />
    </>
  );
}
