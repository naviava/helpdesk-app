import Logo from "@/components/logo";
import SignInScreen from "@/components/auth/sign-in-screen";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

export default function SignInClient() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full gap-2 translate-y-[-3rem]">
        <Logo />
        <h1 className="text-3xl font-bold mt-4">Welcome to Helpdesk</h1>
        <SignInScreen />
      </div>
      <div className="absolute bottom-5 right-5 md:bottom-10 md:right-10">
        <ThemeToggleButton />
      </div>
    </>
  );
}
