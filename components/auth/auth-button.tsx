"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "next-auth/react";
import { LogOut, Settings, UserCircle2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { serverClient } from "@/app/_trpc/server-client";

interface AuthButtonProps {
  user: Awaited<ReturnType<(typeof serverClient)["getUserProfile"]>>;
}

export default function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter();

  const accountOptions = useMemo(
    () => [
      {
        label: "My Profile",
        Icon: UserCircle2,
        action: () => router.push("/user"),
      },
      {
        label: "Manage account",
        Icon: Settings,
        action: () => router.push("/user/manage-account"),
      },
      {
        label: "Sign out",
        Icon: LogOut,
        action: () => signOut(),
      },
    ],
    [router],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarImage src={user?.image || ""} alt="User profile image" />
          <AvatarFallback className="bg-slate-300 text-xl font-extrabold dark:bg-slate-700">
            {user?.name?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-slate-800">
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-slate-700" />
        {accountOptions.map((option) => (
          <DropdownMenuItem
            key={option.label}
            onClick={option.action}
            className="flex gap-2 dark:hover:bg-slate-700"
          >
            {option.label}
            <option.Icon className="ml-auto h-4 w-4 text-gray-400" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
