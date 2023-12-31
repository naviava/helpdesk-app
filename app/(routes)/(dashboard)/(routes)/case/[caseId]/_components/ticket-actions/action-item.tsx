"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { trpc } from "@/app/_trpc/client";

interface ActionItemProps {
  icon: any;
  label: string;
  href: string;
  helpdeskOnly?: boolean;
}

export default function ActionItem({
  icon: Icon,
  label,
  href,
  helpdeskOnly,
}: ActionItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [_, setBottomDiv] = useState("");
  const [topDiv, setTopDiv] = useState("");

  const { data: user } = trpc.user.getUserProfile.useQuery();

  const isHelpdesk = useMemo(
    () => user?.role === "ADMIN" || user?.role === "AGENT",
    [user?.role],
  );

  const isActive = useMemo(() => pathname === href, [pathname, href]);

  useEffect(() => {
    setTopDiv(label);
    setBottomDiv(label);
  }, [label]);

  if (helpdeskOnly && !isHelpdesk) return null;

  return (
    <li
      role="button"
      onClick={() => {
        setTopDiv(label);
        setBottomDiv(label);
        router.push(href);
      }}
      className="relative flex items-center justify-center p-1"
    >
      <Icon className="mr-2 h-5 w-5 md:h-7 md:w-7 md:translate-x-0" />
      <span className="text-xs sm:text-sm lg:text-base">{label}</span>
      {isActive && topDiv === label && (
        <>
          <motion.div
            layoutId="activeSection"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute inset-x-0 top-0 hidden h-[0.2rem] rounded-full bg-black bg-sky-500/50 md:block"
          />
          <motion.div
            layoutId="activeSection2"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute inset-x-0 bottom-0 h-[0.2rem] rounded-full bg-black bg-sky-500/50"
          />
        </>
      )}
    </li>
  );
}
