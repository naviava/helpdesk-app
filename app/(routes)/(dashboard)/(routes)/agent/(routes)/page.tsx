import PageHeading from "@/components/page-heading";

interface AgentPageProps {}

export default async function AgentPage({}: AgentPageProps) {
  return (
    <div className="px-2 py-6 md:p-6">
      <PageHeading title="Agent dashboard" />
    </div>
  );
}
