import Logo from "@/components/logo";
import SidebarRoutes from "./sidebar-routes";

interface Props {
  closeSidebar: () => void;
}

export default function Sidebar({ closeSidebar }: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r bg-slate-200 shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex w-full flex-1 flex-col">
        <SidebarRoutes closeSidebar={closeSidebar} />
      </div>
    </div>
  );
}
