import Navbar from "../_components/navbar";
import Sidebar from "../_components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-[4rem] w-full md:pl-56">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
        <Sidebar />
      </div>
      <main className="flex h-full flex-col pt-[4rem] md:pl-56">
        <div className="flex-1 bg-slate-100 dark:bg-slate-900">{children}</div>
      </main>
    </div>
  );
}
