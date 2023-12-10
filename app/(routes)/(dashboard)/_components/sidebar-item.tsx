"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LucideIcon } from "lucide-react";

import IconBadge from "@/components/icon-badge";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  closeSidebar: () => void;
}

export default function SidebarItem({
  icon,
  label,
  href,
  closeSidebar,
}: SidebarItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = useMemo(() => pathname.startsWith(href), [pathname, href]);

  const handleClick = useCallback(() => {
    router.push(href);
    closeSidebar();
  }, [router, href, closeSidebar]);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex h-14 w-full items-center justify-between text-left hover:cursor-pointer hover:bg-slate-300/50",
          isActive && "bg-slate-300 hover:bg-slate-300",
        )}
      >
        <div className="flex items-center gap-x-3 px-4">
          <IconBadge icon={icon} />
          <span>{label}</span>
        </div>
        <div
          className={cn(
            "ml-auto h-full border-2 border-sky-400 opacity-0",
            isActive && "opacity-100",
          )}
        />
      </button>
      <Separator />
    </>
  );
}
