import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { serverClient } from "@/app/_trpc/server-client";

interface TicketLogsProps {
  ticketId: string;
}

export default async function TicketLogs({ ticketId }: TicketLogsProps) {
  const logs = await serverClient.ticket.getTicketLogs({ ticketId });

  return (
    <ScrollArea className="h-[30vh]">
      <section className="space-y-4 p-2">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center gap-x-4">
            <div className="shrink-0 text-xs italic text-muted-foreground">
              {format(new Date(log.createdAt), "MMM dd, yyyy @ HH:mm")}
            </div>
            <Separator orientation="vertical" className="h-6 bg-slate-300" />
            <p>{log.text}</p>
          </div>
        ))}
      </section>
    </ScrollArea>
  );
}
