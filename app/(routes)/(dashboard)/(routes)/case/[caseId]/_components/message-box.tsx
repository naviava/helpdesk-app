import { Attachment, Message, User } from "@prisma/client";

import { Separator } from "@/components/ui/separator";
import AttachmentBox from "./attachment-box";

import { calculateOpenedDuration } from "@/lib/calc-open-duration";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MessageBoxProps {
  message: Message & {
    user: User;
    attachments: Attachment[];
  };
  ticketOwnerId: string;
}

export default function MessageBox({
  message,
  ticketOwnerId,
}: MessageBoxProps) {
  const isSentByTicketOwner = ticketOwnerId === message.user.id;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={message.id}>
        <section className="space-y-2 rounded-sm bg-white pl-2 pr-6 shadow-lg">
          <AccordionTrigger>
            <div className="w-full">
              <div className="flex items-start justify-between space-y-1">
                {/* Sender name. */}
                <div className="flex items-center gap-x-1">
                  <h5 className="text-xs text-muted-foreground md:text-sm">
                    From:
                  </h5>
                  <span className="md:text-lg">{message.user.name}</span>
                  {isSentByTicketOwner && (
                    <span className="text-xs text-muted-foreground md:text-sm">
                      (Ticket owner)
                    </span>
                  )}
                </div>
                <span className="text-xs italic text-muted-foreground">{`${calculateOpenedDuration(
                  message.createdAt,
                )} ago`}</span>
              </div>
              {/* Date. */}
              <div className="flex items-center gap-x-1 text-xs text-muted-foreground md:text-sm">
                <h5>Date:</h5>
                <span>
                  {format(new Date(message.createdAt), "LLLL d, yyyy, h:mm aa")}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Separator />
            <div className="my-2 space-y-1">
              <h5 className="text-xs text-muted-foreground md:text-sm">
                Message:
              </h5>
              <p className="text-sm md:text-base">{message.content}</p>
            </div>
            {message.attachments.length > 0 && (
              <>
                <Separator />
                <div className="mt-2 space-y-2">
                  <h5 className="text-xs text-muted-foreground">{`${
                    message.attachments.length
                  } ${
                    message.attachments.length === 1
                      ? "attachment"
                      : "attachments"
                  }`}</h5>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-3 xl:grid-cols-5">
                    {message.attachments.map((attachment) => (
                      <AttachmentBox key={attachment.id} data={attachment} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </AccordionContent>
        </section>
      </AccordionItem>
    </Accordion>
  );
}
