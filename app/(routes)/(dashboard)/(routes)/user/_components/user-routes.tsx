"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { serverClient } from "@/app/_trpc/server-client";

interface UserRoutesProps {
  user: Awaited<ReturnType<(typeof serverClient)["user"]["getUserProfile"]>>;
}

export default function UserRoutes({}: UserRoutesProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "About",
      href: "/user",
      isActive: pathname === "/user",
    },
    {
      label: "Ticket Summary",
      href: "/user/ticket-summary",
      isActive: pathname === "/user/ticket-summary",
    },
  ];

  return (
    <ul className="border-b-2">
      <div className="ml-6 flex items-center gap-x-20">
        {routes.map((route) => (
          <li
            key={route.href}
            className={cn(
              "pb-1",
              route.isActive && "border-b-2 border-sky-500 text-sky-600",
            )}
          >
            <Link href={route.href}>{route.label}</Link>
          </li>
        ))}
      </div>
    </ul>
  );
}
