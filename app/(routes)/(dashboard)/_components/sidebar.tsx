import Logo from "@/components/logo";
import SidebarRoutes from "./sidebar-routes";

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r bg-slate-200 shadow-sm dark:bg-slate-800">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex w-full flex-1 flex-col">
        <SidebarRoutes />
      </div>
    </div>
  );
}
