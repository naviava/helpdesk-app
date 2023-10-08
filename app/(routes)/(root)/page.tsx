import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import Logo from "@/components/logo";
import SignInOptions from "@/components/auth/sign-in-options";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

import { db } from "@/lib/db";

export default async function Home() {
  const session = await getServerSession();

  if (!session?.user?.email)
    return (
      <>
        <div className="flex flex-col justify-center items-center h-full gap-2 translate-y-[-3rem]">
          <Logo />
          <h1 className="text-3xl font-bold mt-4">Welcome to Helpdesk</h1>
          <p className="text-gray-600">Sign in using one of the below</p>
          <div className="flex flex-col gap-6 mt-10">
            <SignInOptions />
          </div>
        </div>
        <div className="absolute bottom-5 right-5 md:bottom-10 md:right-10">
          <ThemeToggleButton />
        </div>
      </>
    );

  const user = await db.user.findUnique({
    where: { email: session.user?.email },
    select: { role: true },
  });

  if (!user) return null;

  if (user.role === "ADMIN" || user.role === "AGENT") {
    return redirect("/agent");
  } else {
    return redirect("/user");
  }
}
