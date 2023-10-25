"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export default function UserRoutes() {
  const pathname = usePathname();

  const routes = [
    {
      label: "About",
      href: "/user/profile",
      isActive: pathname === "/user/profile",
    },
    {
      label: "Ticket Summary",
      href: "/user/profile/ticket-summary",
      isActive: pathname === "/user/profile/ticket-summary",
    },
  ];

  return (
    <ul className="border-b-2">
      <div className="ml-6 flex items-center gap-x-10">
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
