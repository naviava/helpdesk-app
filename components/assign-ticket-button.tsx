"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { trpc } from "@/app/_trpc/client";

interface AssignTicketButtonProps {
  self?: boolean;
}

export default function AssignTicketButton({ self }: AssignTicketButtonProps) {
  const router = useRouter();
  const params = useParams();

  const { data: user } = trpc.user.getUserProfile.useQuery();
  const { data: ticket } = trpc.ticket.getTicketById.useQuery({
    id: params.caseId as string,
  });

  const { mutate: assignTicket, isLoading } =
    trpc.ticket.assignTicket.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: () => {
        router.refresh();
        toast.success("Ticket assigned");
      },
    });

  const handleAssign = useCallback(
    (agentEmail: string) =>
      assignTicket({
        ticketId: params.caseId as string,
        agentEmail,
      }),
    [params.caseId, assignTicket],
  );

  if (!user) return null;

  if (self && user.email !== ticket?.agent?.email)
    return (
      <Button
        variant="theme"
        size="sm"
        disabled={isLoading}
        onClick={() => handleAssign(user.email)}
        className="h-fit"
      >
        Assign to me
      </Button>
    );

  return null;
}
