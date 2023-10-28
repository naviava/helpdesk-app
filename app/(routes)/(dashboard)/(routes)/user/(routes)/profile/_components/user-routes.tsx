"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function UserRoutes() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

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

  useEffect(() => {
    setActiveSection(pathname);
  }, [pathname]);

  return (
    <ul className="border-b-2">
      <div className="flex items-center justify-around md:justify-start md:gap-x-10">
        {routes.map((route) => (
          <li
            key={route.href}
            className={cn("relative pb-1", route.isActive && "text-sky-600")}
          >
            <Link href={route.href}>{route.label}</Link>
            {activeSection === route.href && (
              <motion.div
                layoutId="activeSection"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-x-0 bottom-0 hidden h-[0.2rem] rounded-full bg-black bg-sky-500/50 md:block"
              />
            )}
          </li>
        ))}
      </div>
    </ul>
  );
}
