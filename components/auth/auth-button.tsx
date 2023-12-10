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
        action: () => router.push("/user/profile"),
      },
      // {
      //   label: "Manage account",
      //   Icon: Settings,
      //   action: () => {},
      // },
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
            <AvatarFallback className="bg-slate-300 text-sm font-medium">
              {user?.name?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm">Hi, {user?.name}</p>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex gap-x-4 pt-2">
            <Avatar className="">
              <AvatarImage src={user?.image || ""} alt="User profile image" />
              <AvatarFallback className="bg-slate-300 text-2xl font-medium">
                {user?.name?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="line-clamp-2 max-w-[6rem] space-y-1 md:max-w-[8rem]">
                {user?.name}
              </h2>
              <p className="text-xs font-normal text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accountOptions.map((option) => (
          <DropdownMenuItem
            key={option.label}
            onClick={option.action}
            className="flex gap-2"
          >
            {option.label}
            <IconBadge icon={option.Icon} className="ml-auto" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
