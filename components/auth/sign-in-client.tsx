import Logo from "@/components/logo";
import SignInScreen from "@/components/auth/sign-in-screen";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

export default function SignInClient() {
  return (
    <div className="h-screen">
      <div className="flex h-full -translate-y-3 flex-col items-center justify-center gap-2">
        <Logo />
        <h1 className="mt-4 text-3xl font-bold">Welcome to Helpdesk</h1>
        <SignInScreen />
      </div>
      <div className="absolute bottom-5 right-5 md:bottom-10 md:right-10">
        <ThemeToggleButton />
      </div>
    </div>
  );
}
