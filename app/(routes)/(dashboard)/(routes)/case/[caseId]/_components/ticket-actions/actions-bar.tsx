"use client";

import { v4 as uuid } from "uuid";
import { Mail } from "lucide-react";
import StatusToggleButton from "./status-toggle-button";
import { serverClient } from "@/app/_trpc/server-client";
import ActionItem from "./action-item";
import { FcFolder } from "react-icons/fc";
import { useMemo } from "react";

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
        icon: Mail,
        label: "Notes",
        href: `/case/${ticket.id}/notes`,
      },
      {
        id: uuid(),
        icon: Mail,
        label: "Options",
        href: `/case/${ticket.id}/assign`,
      },
    ],
    [ticket.id],
  );

  return (
    <section className="flex items-center justify-between pl-2">
      <ul className="flex items-center gap-x-2 md:gap-x-10">
        {actionItems.map((item) => (
          <ActionItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            href={item.href}
          />
        ))}
      </ul>
      <div className="space-x-2">
        {!isResolved && !isOnHold && (
          <StatusToggleButton
            ticketId={ticket.id}
            newStatus="ON_HOLD"
            text="Hold"
          />
        )}
        <StatusToggleButton
          ticketId={ticket.id}
          newStatus={newStatus}
          text={statusToggleText}
          className="bg-emerald-500 text-white"
        />
      </div>
    </section>
  );
}
