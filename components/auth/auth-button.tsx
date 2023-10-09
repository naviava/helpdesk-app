"use client";

import { useSession, signOut, signIn } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggleButton } from "../theme-toggle-button";

export default function AuthButton() {
  const { data: session } = useSession();

  if (!session)
    return <button onClick={() => signIn("google")}>Sign in</button>;

  return (
    <>
      <ThemeToggleButton />
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar>
            <AvatarImage
              src={session?.user?.image || ""}
              alt="User profile image"
            />
            <AvatarFallback>
              {session?.user?.name?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:bg-slate-800">
          <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-700" />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="dark:hover:bg-slate-700"
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
