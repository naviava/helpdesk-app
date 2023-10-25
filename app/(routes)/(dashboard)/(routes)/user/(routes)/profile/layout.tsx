import UserRoutes from "./_components/user-routes";

interface UserProfileLayoutProps {
  children: React.ReactNode;
}

export default async function UserProfileLayout({
  children,
}: UserProfileLayoutProps) {
  return (
    <>
      <div className="mt-10">
        <UserRoutes />
      </div>
      <>{children}</>
    </>
  );
}
