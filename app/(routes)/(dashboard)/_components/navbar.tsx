import AuthButton from "@/components/auth/auth-button";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

interface NavbarProps {}

export default function Navbar({}: NavbarProps) {
  return (
    <div className="flex h-full items-center justify-end border-b bg-slate-100 p-4 shadow-sm dark:bg-slate-900">
      {/* <MobileSidebar />
      <NavbarRoutes /> */}
      <div className="flex gap-x-4 pr-6">
        <ThemeToggleButton />
        <AuthButton />
      </div>
    </div>
  );
}
