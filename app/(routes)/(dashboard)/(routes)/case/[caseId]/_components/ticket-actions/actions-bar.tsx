"use client";

import { useMemo, useState } from "react";

import { v4 as uuid } from "uuid";
import { FcAbout, FcFolder } from "react-icons/fc";

import StatusToggleButton from "./status-toggle-button";
import TicketActions from "./ticket-actions";
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
      },
    ],
    [ticket.id],
  );

  return (
    <section className="flex items-center justify-between pl-2">
      <ul className="flex items-center gap-x-10">
        {actionItems.map((item) => (
          <ActionItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            href={item.href}
          />
        ))}
        <li className="hidden lg:block">
          <TicketActions />
        </li>
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
