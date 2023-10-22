"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "next-auth/react";
import { ChevronDown, LogOut, Settings, UserCircle2 } from "lucide-react";

import IconBadge from "@/components/icon-badge";
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
  user: Awaited<ReturnType<(typeof serverClient)["user"]["getUserProfile"]>>;
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
        action: () => {},
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
        <div className="flex items-center gap-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.image || ""} alt="User profile image" />
            <AvatarFallback className="bg-slate-300 text-sm font-medium dark:bg-slate-700">
              {user?.name?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm">Hi, {user?.name}</p>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-slate-800">
        <DropdownMenuLabel>
          <div className="flex gap-x-4 pt-2">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user?.image || ""} alt="User profile image" />
              <AvatarFallback className="bg-slate-300 text-3xl font-medium dark:bg-slate-700">
                {user?.name?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="space-y-1 text-xl">{user?.name}</div>
              <p className="text-xs font-normal text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-slate-700" />
        {accountOptions.map((option) => (
          <DropdownMenuItem
            key={option.label}
            onClick={option.action}
            className="flex gap-2 dark:hover:bg-slate-700"
          >
            {option.label}
            <IconBadge icon={option.Icon} className="ml-auto" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
