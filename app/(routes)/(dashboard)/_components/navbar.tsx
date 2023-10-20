import MobileSidebar from "./mobile-sidebar";
import { serverClient } from "@/app/_trpc/server-client";
import NavbarRoutes from "./navbar-routes";

export default async function Navbar() {
  const user = await serverClient.user.getUserProfile();

  return (
    <div className="flex h-full items-center justify-between border-b bg-slate-100 p-4 shadow-sm dark:bg-slate-900 md:justify-end">
      <MobileSidebar />
      <NavbarRoutes user={user} />
    </div>
  );
}
