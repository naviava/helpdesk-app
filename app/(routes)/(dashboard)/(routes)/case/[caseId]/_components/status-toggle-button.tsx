"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { trpc } from "@/app/_trpc/client";

interface TicketStatusToggleButtonProps {
  ticketId: string;
  newStatus: "ON_HOLD" | "RESOLVED" | "REOPENED";
  text: string;
}

export default function StatusToggleButton({
  ticketId,
  newStatus,
  text,
}: TicketStatusToggleButtonProps) {
  const router = useRouter();

  const toastTextMap = useMemo(
    () => ({
      ON_HOLD: "Ticket put on hold",
      RESOLVED: "Ticket mark as resolved",
      REOPENED: "Re-opened ticket",
    }),
    [],
  );

  const { mutate: toggleStatus, isLoading } =
    trpc.ticket.toggleStatus.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: () => {
        router.refresh();
        toast.success(toastTextMap[newStatus]);
      },
    });

  const handleStatusChange = useCallback(
    () => toggleStatus({ ticketId, newStatus }),
    [toggleStatus, ticketId, newStatus],
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        disabled={isLoading}
        onClick={handleStatusChange}
      >
        {text}
      </Button>
    </>
  );
}
