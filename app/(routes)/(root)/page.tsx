import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import SignInClient from "@/components/auth/sign-in-client";

export default async function Home() {
  const session = await getServerSession();

  if (!session?.user?.email) return <SignInClient />;

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
