"use client";

import Link from "next/link";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Priority, TicketStatus, UserRole } from "@prisma/client";

import PriorityTag from "@/components/priority-tag";
import StatusBadge from "@/components/status-badge";

import { calculateOpenedDuration } from "@/lib/calc-open-duration";

interface TableTicketData {
  id: string;
  refId: string;
  title: string;
  priority: Priority;
  status: TicketStatus;
  category?: string;
  department?: string;
  owner: string;
  ownerEmail?: string;
  agent?: string;
  agentEmail?: string;
  currentUserRole?: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export const columns: ColumnDef<TableTicketData>[] = [
  // Ref ID.
  {
    accessorKey: "refId",
    header: ({ column }) => {
      return <div className="shrink-0">REF ID</div>;
    },
    cell: ({ row }) => {
      const { id, refId } = row.original;

      return (
        <div className="min-w-[7rem]">
          <Link href={`/case/${id}`} className="text-sky-700 hover:underline">
            {refId}
          </Link>
        </div>
      );
    },
  },
  // Title.
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-[15rem] items-center"
        >
          TICKET NAME
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const { id, refId, title } = row.original;

      return (
        <Link
          href={`/case/${id}`}
          className="line-clamp-1 min-w-[12rem] max-w-[15rem] text-sky-700 hover:underline"
        >
          {title}
        </Link>
      );
    },
  },
  // Open for
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center whitespace-nowrap"
        >
          OPEN FOR
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const { createdAt } = row.original;
      const displayString = calculateOpenedDuration(createdAt);

      return <div>{displayString}</div>;
    },
  },
  // Priority
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          PRIORITY
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const { priority } = row.original;

      return <PriorityTag priority={priority} />;
    },
  },
  // Status.
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          STATUS
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const { status } = row.original;

      return <StatusBadge status={status} />;
    },
  },
  // Owner.
  {
    accessorKey: "owner",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          OWNER
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
  // Agent.
  {
    accessorKey: "agent",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex select-none items-center whitespace-nowrap"
        >
          ASSIGNED TO
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const agent = row.getValue("agent") as string;

      if (!agent)
        return <span className="italic text-muted-foreground">Unassigned</span>;

      return <span>{agent}</span>;
    },
  },
  // Last activity.
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex select-none items-center whitespace-nowrap"
        >
          LAST ACTIVITY
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const { updatedAt } = row.original;
      const displayString = calculateOpenedDuration(updatedAt);

      return <div>{displayString}</div>;
    },
  },
];
