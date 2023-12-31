"use client";

import { motion } from "framer-motion";

import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBox from "./message-box";

import { serverClient } from "@/app/_trpc/server-client";

interface MessagesAreaProps {
  ticket: Awaited<ReturnType<typeof serverClient.ticket.getTicketById>>;
}

function MessagesArea({ ticket }: MessagesAreaProps) {
  return (
    <div className="relative max-h-[70vh] flex-1 md:max-h-[50vh] lg:max-h-[80vh] xl:max-h-[70vh]">
      <ScrollArea className="flex max-h-[70vh] flex-col md:max-h-[50vh] lg:max-h-[80vh] xl:max-h-[70vh]">
        {ticket.messages.map((message) => (
          <MessageBox key={message.id} message={message} />
        ))}
      </ScrollArea>
      <motion.div
        className="absolute bottom-0 w-full bg-slate-100"
        initial={{ height: "100%" }}
        animate={{ height: 0 }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
        exit={{ height: "100%" }}
      />
    </div>
  );
}

export default MessagesArea;
