import PageHeading from "@/components/page-heading";
import UserRoutes from "./_components/user-routes";
import { serverClient } from "@/app/_trpc/server-client";

interface UserProfileLayoutProps {
  children: React.ReactNode;
}

export default async function UserProfileLayout({
  children,
}: UserProfileLayoutProps) {
  const user = await serverClient.user.getUserProfile();

  return (
    <>
      <PageHeading
        title={`Welcome, ${user?.name}`}
        tagline="Customize your profile and stand out from the crowd."
      />
      <article className="mx-auto mt-4 max-w-6xl">
        <UserRoutes />
        {children}
      </article>
    </>
  );
}
