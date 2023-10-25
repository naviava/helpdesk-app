import PageHeading from "@/components/page-heading";
import { serverClient } from "@/app/_trpc/server-client";
import { redirect } from "next/navigation";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
  const user = await serverClient.user.getUserProfile();

  return (
    <div className="h-full px-2 py-6 md:p-6">
      <PageHeading
        title={`Welcome, ${user?.name}`}
        tagline="All data here is related to your account."
      />
      <>{children}</>
    </div>
  );
}
