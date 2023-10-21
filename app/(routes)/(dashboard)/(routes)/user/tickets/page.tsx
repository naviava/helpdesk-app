import PageHeading from "@/components/page-heading";
import TicketsList from "@/components/tickets-list";

interface MyTicketsPageProps {}

export default function MyTicketsPage({}: MyTicketsPageProps) {
  return (
    <>
      <PageHeading
        title="My Tickets"
        tagline="All your unresolved tickets are displayed here"
      />
      <div className="mt-4">
        <TicketsList />
      </div>
    </>
  );
}
