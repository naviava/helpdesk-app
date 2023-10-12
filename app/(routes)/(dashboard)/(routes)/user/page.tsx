import PageHeading from "@/components/page-heading";
import { serverClient } from "@/app/_trpc/server-client";

interface UserPageProps {}

export default async function UserPage({}: UserPageProps) {
  const user = await serverClient.getUserProfile();

  return (
    <div className="p-6">
      <PageHeading
        title={`Welcome, ${user?.name}`}
        tagline="All data here is related to your account."
      />
    </div>
  );
}
