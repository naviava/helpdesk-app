"use client";

import { useEffect, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBox from "./message-box";

import { serverClient } from "@/app/_trpc/server-client";

interface MessagesAreaProps {
  ticket: Awaited<ReturnType<typeof serverClient.ticket.getTicketById>>;
}

function MessagesArea({ ticket }: MessagesAreaProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parentRef.current && scrollAreaRef.current) {
      scrollAreaRef.current.style.height = `${parentRef.current.clientHeight}px`;
    }
  }, []);

  return (
    <div ref={parentRef} className="max-h-[60%] flex-1 lg:max-h-[90%]">
      <ScrollArea ref={scrollAreaRef} className="flex max-h-[90%] flex-col">
        {ticket.messages.map((message) => (
          <MessageBox
            key={message.id}
            message={message}
            ticketOwnerId={ticket.owner.id}
          />
        ))}
      </ScrollArea>
    </div>
  );
}

export default MessagesArea;
