import PageHeading from "@/components/page-heading";

interface MyTicketsPageProps {}

export default function MyTicketsPage({}: MyTicketsPageProps) {
  return (
    <div className="p-6">
      <PageHeading
        title="My Tickets"
        tagline="All your unresolved tickets are displayed here"
      />
      <div></div>
    </div>
  );
}
