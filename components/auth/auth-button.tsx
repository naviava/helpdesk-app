"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  ChevronDown,
  LogOut,
  RefreshCcw,
  Settings,
  UserCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import IconBadge from "@/components/icon-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { trpc } from "@/app/_trpc/client";
import { serverClient } from "@/app/_trpc/server-client";
import { useIsMounted } from "@/hooks/use-is-mounted";

interface AuthButtonProps {
  initialData: Awaited<
    ReturnType<(typeof serverClient)["user"]["getUserProfile"]>
  >;
}

export default function AuthButton({ initialData }: AuthButtonProps) {
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

  const utils = trpc.useUtils();

  const { data: user } = trpc.user.getUserProfile.useQuery(undefined, {
    initialData,
  });

  const { mutate: handleToggleRole, data: newRole } =
    trpc.user.toggleRole.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: (data) => {
        toast.success(`Acting as ${data} now. Refreshing page...`);
        utils.user.invalidate();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
    });

  const isMounted = useIsMounted();
  if (!isMounted) return null;

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
      <DropdownMenuContent align="end" className="w-[15rem]">
        <DropdownMenuLabel>
          <div className="flex gap-x-4 pt-2">
            <Avatar>
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleToggleRole()}>
          <span className="mr-1 text-xs text-muted-foreground text-neutral-400">
            Current role:
          </span>
          <span className="text-xs capitalize text-neutral-600">
            {user?.role.toLowerCase()}
          </span>
          <RefreshCcw className="ml-auto h-4 w-4 text-neutral-400" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
