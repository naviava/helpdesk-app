"use client";

import Link from "next/link";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Priority, TicketStatus, UserRole } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

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
  createdAt: string;
  updatedAt: string;
}

const priorityColorMap = {
  LOW: "bg-green-600",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-red-600",
};

const statusMap = {
  NEW: { colors: "bg-rose-500/20 text-rose-600", text: "New" },
  NEW_REPLY: {
    colors: "bg-fuchsia-500/20 text-fuchsia-600",
    text: "User reply",
  },
  WAITING_REPLY: {
    colors: "bg-blue-500/20 text-blue-600",
    text: "Waiting",
  },
  ON_HOLD: { colors: "bg-yellow-500/20 text-yellow-600", text: "On hold" },
  RESOLVED: { colors: "bg-emerald-500/20 text-emerald-600", text: "Resolved" },
};

export const columns: ColumnDef<TableTicketData>[] = [
  {
    accessorKey: "refId",
    header: "REF ID",
    cell: ({ row }) => {
      const { id, refId } = row.original;

      return (
        <Link href={`/case/${id}`} className="text-sky-700 hover:underline">
          {refId}
        </Link>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          TICKET NAME
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const { id, refId, title } = row.original;

      return (
        <Link href={`/case/${id}`} className="text-sky-700 hover:underline">
          {title}
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          CREATE DATE
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
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

      if (priority === "CRITICAL") {
        return (
          <span className="font-semibold text-fuchsia-700">**{priority}**</span>
        );
      } else {
        return (
          <div className="flex items-center gap-x-2">
            <div
              className={cn("h-2 w-2 rounded-full", priorityColorMap[priority])}
            />
            <span>{priority.charAt(0) + priority.slice(1).toLowerCase()}</span>
          </div>
        );
      }
    },
  },
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

      return (
        <Badge className={cn("select-none truncate", statusMap[status].colors)}>
          <span>{statusMap[status].text}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          CATEGORY
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          DEPARTMENT
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
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
  {
    accessorKey: "agent",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          ASSIGNED TO
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const { agentEmail } = row.original;
      const agent = row.getValue("agent") as string;

      if (!agent)
        return <span className="italic text-muted-foreground">Unassigned</span>;

      return <span>{agent}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <div
          role="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          LAST ACTIVITY
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
];
