"use client";

import { useMemo, useState } from "react";

import { v4 as uuid } from "uuid";
import { FcAbout, FcFolder, FcSettings } from "react-icons/fc";

import ActionItem from "./action-item";

import { serverClient } from "@/app/_trpc/server-client";

interface ActionsBarProps {
  ticket: Awaited<ReturnType<(typeof serverClient)["ticket"]["getTicketById"]>>;
}

export default function ActionsBar({ ticket }: ActionsBarProps) {
  const isResolved = useMemo(
    () => ticket.status === "RESOLVED",
    [ticket.status],
  );
  const isOnHold = useMemo(() => ticket.status === "ON_HOLD", [ticket.status]);
  const newStatus = useMemo(
    () => (!isResolved ? "RESOLVED" : "REOPENED"),
    [isResolved],
  );
  const statusToggleText = useMemo(
    () => (!isResolved ? "Close" : "Re-open"),
    [isResolved],
  );

  const actionItems = useMemo(
    () => [
      {
        id: uuid(),
        icon: FcFolder,
        label: "Messages",
        href: `/case/${ticket.id}`,
      },
      {
        id: uuid(),
        icon: FcAbout,
        label: "Technical Notes",
        href: `/case/${ticket.id}/notes`,
        helpdeskOnly: true,
      },
      {
        id: uuid(),
        icon: FcSettings,
        label: "Options",
        href: `/case/${ticket.id}/options`,
      },
    ],
    [ticket.id],
  );

  return (
    <ul className="flex items-center justify-around gap-x-2">
      {actionItems.map((item) => (
        <ActionItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          href={item.href}
          helpdeskOnly={item.helpdeskOnly}
        />
      ))}
    </ul>
  );
}
