import PageHeading from "@/components/page-heading";
import { serverClient } from "@/app/_trpc/server-client";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
  return <div className="h-full px-2 py-6 md:p-6">{children}</div>;
}
