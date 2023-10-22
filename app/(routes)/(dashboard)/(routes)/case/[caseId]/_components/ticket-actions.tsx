import { serverClient } from "@/app/_trpc/server-client";

interface TicketActionsProps {
  initialData: Awaited<
    ReturnType<(typeof serverClient)["ticket"]["getTicketById"]>
  >;
}

export default function TicketActions({ initialData }: TicketActionsProps) {
  return <div>TODO: Actions</div>;
}
