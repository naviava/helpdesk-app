"use client";

import { useCallback, useMemo } from "react";

import { signOut } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { trpc } from "@/app/_trpc/client";
import { serverClient } from "@/app/_trpc/server-client";

interface AuthButtonProps {
  initialData?: Awaited<ReturnType<(typeof serverClient)["getUserProfile"]>>;
}

export default function AuthButton({ initialData }: AuthButtonProps) {
  const { data: user } = trpc.getUserProfile.useQuery(undefined, {
    initialData: initialData,
  });

  const manageAccount = useCallback(() => {}, []);

  const accountOptions = useMemo(
    () => [
      {
        label: "Manage account",
        Icon: Settings,
        action: manageAccount,
      },
      {
        label: "Sign out",
        Icon: LogOut,
        action: () => signOut(),
      },
    ],
    [manageAccount],
  );

  return (
    <div className="flex gap-2">
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
              <option.Icon className="ml-auto h-4 w-4 text-gray-400 dark:text-gray-500" />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
