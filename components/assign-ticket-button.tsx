"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { trpc } from "@/app/_trpc/client";

export default function AssignTicketButton() {
  const router = useRouter();
  const params = useParams();
  const [isVisible, setIsVisible] = useState(true);

  const { data: user } = trpc.user.getUserProfile.useQuery();
  const { data: ticket } = trpc.ticket.getTicketById.useQuery({
    id: params.caseId as string,
  });

  useEffect(() => {
    if (user?.email === ticket?.agent?.email) setIsVisible(false);
  }, [user?.email, ticket?.agent?.email]);

  const { mutate: assignTicket, isLoading } =
    trpc.ticket.assignTicket.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: () => {
        router.refresh();
        toast.success("Ticket assigned");
        setIsVisible(false);
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

  return (
    <>
      {isVisible ? (
        <Button
          variant="theme"
          size="sm"
          disabled={isLoading}
          onClick={() => handleAssign(user.email)}
          className="h-fit"
        >
          Assign to me
        </Button>
      ) : (
        <></>
      )}
    </>
  );
}
