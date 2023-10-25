"use client";

import { useEffect, useState } from "react";

import { ChevronDown } from "lucide-react";
import { FcSettings } from "react-icons/fc";

import { serverClient } from "@/app/_trpc/server-client";

interface TicketActionsProps {
  initialData?: Awaited<
    ReturnType<(typeof serverClient)["ticket"]["getTicketById"]>
  >;
}

export default function TicketActions({ initialData }: TicketActionsProps) {
  const [isMounted, setIsmounted] = useState(false);

  useEffect(() => setIsmounted(true), []);
  if (!isMounted) return null;

  return (
    <div role="button" className="flex items-center gap-x-1">
      <FcSettings className="mr-1 h-5 w-5 lg:mr-2 lg:h-7 lg:w-7" />
      <span className="text-base">Options</span>
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
