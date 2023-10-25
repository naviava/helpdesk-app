"use client";

import { LucideIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { IconType } from "react-icons";

interface ActionItemProps {
  icon: any;
  label: string;
  href: string;
}

export default function ActionItem({
  icon: Icon,
  label,
  href,
}: ActionItemProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <li
      role="button"
      onClick={() => router.push(href)}
      className="flex min-w-[4rem] items-center py-2"
    >
      <Icon className="bg mx-auto mr-2 h-8 w-8 -translate-x-2 md:h-6 md:w-6 md:translate-x-0" />
      <span className="hidden md:block">{label}</span>
    </li>
  );
}
