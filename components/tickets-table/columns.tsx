"use client";

import Link from "next/link";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Priority, TicketStatus, UserRole } from "@prisma/client";

import PriorityTag from "@/components/priority-tag";
import StatusBadge from "@/components/status-badge";

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

      return <PriorityTag priority={priority} />;
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

      return <StatusBadge status={status} />;
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
