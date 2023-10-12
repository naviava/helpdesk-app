import PageHeading from "@/components/page-heading";
import CreateTicketForm from "./_components/create-ticket-form";

interface CreateTicketPageProps {}

export default function CreateTicketPage({}: CreateTicketPageProps) {
  return (
    <div className="bg-slate-100 px-2 py-6 dark:bg-slate-900 md:p-6">
      <PageHeading
        title="Create New Ticket"
        tagline="Complete optional fields to expedite the process."
      />
      <CreateTicketForm />
    </div>
  );
}
