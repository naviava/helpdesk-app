import { serverClient } from "@/app/_trpc/server-client";
import PageHeading from "@/components/page-heading";
import UserRoutes from "./_components/user-routes";

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
      <div className="mt-10">
        <UserRoutes user={user} />
      </div>
      <>{children}</>
    </div>
  );
}
