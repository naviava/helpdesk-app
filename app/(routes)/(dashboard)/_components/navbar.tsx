import AuthButton from "@/components/auth/auth-button";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import MobileSidebar from "./mobile-sidebar";

interface NavbarProps {}

export default function Navbar({}: NavbarProps) {
  return (
    <div className="flex h-full items-center justify-between border-b bg-slate-100 p-4 shadow-sm dark:bg-slate-900 md:justify-end">
      <MobileSidebar />
      <div className="flex gap-x-6">
        <ThemeToggleButton />
        <AuthButton />
      </div>
    </div>
  );
}
