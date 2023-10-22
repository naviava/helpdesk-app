import PageHeading from "@/components/page-heading";
import CreateTicketForm from "./_components/create-ticket-form";

interface CreateTicketPageProps {}

export default function CreateTicketPage({}: CreateTicketPageProps) {
  return (
    <div className="px-2 py-6 md:p-6">
      <PageHeading
        title="Create New Ticket"
        tagline="Complete optional fields to expedite the process."
      />
      <CreateTicketForm />
    </div>
  );
}
