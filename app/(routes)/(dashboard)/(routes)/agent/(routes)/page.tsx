import PageHeading from "@/components/page-heading";

interface AgentPageProps {}

export default async function AgentPage({}: AgentPageProps) {
  return (
    <div className="p-6">
      <PageHeading title="Agent dashboard" />
    </div>
  );
}
