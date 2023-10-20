"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LucideIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export default function SidebarItem({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = useMemo(() => pathname.startsWith(href), [pathname, href]);

  const handleClick = useCallback(() => router.push(href), [router, href]);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex h-14 w-full items-center justify-between text-left transition-all hover:cursor-pointer hover:bg-slate-300/50 dark:hover:bg-slate-700/50",
          isActive &&
            "bg-slate-300 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-700",
        )}
      >
        <div className="flex items-center gap-x-3 px-4">
          <Icon className="ml-auto h-6 w-6 rounded-lg bg-sky-400 p-1 text-white dark:bg-sky-700" />
          <span>{label}</span>
        </div>
        <div
          className={cn(
            "ml-auto h-full border-2 border-sky-400 opacity-0 transition-all dark:border-sky-700",
            isActive && "opacity-100",
          )}
        />
      </button>
      <Separator />
    </>
  );
}
