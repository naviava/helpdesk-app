import { format } from "date-fns";
import { Paperclip } from "lucide-react";

import { Attachment, Message, User } from "@prisma/client";

import { Separator } from "@/components/ui/separator";
import AttachmentBox from "./attachment-box";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { calculateOpenedDuration } from "@/lib/calc-open-duration";

interface MessageBoxProps {
  message: Message & {
    sender: User;
    attachments: Attachment[];
  };
}

export default function MessageBox({ message }: MessageBoxProps) {
  const createdDuration = calculateOpenedDuration(message.createdAt);

  return (
    <Accordion type="single" collapsible className="mb-6 md:mb-8 lg:mb-6">
      <AccordionItem value={message.id}>
        <section className="space-y-2 rounded-sm bg-white pl-2 pr-6 shadow-md">
          <AccordionTrigger>
            <div className="w-full">
              <div className="flex items-start justify-between space-y-1">
                {/* Sender name. */}
                <div className="flex items-center">
                  <h5 className="text-xs text-muted-foreground md:text-sm">
                    From:
                  </h5>
                  <span className="ml-1 line-clamp-1 md:text-lg">
                    {message.sender.name}
                  </span>
                </div>
                {/* Opened duration. */}
                <span className="ml-2 shrink-0 text-xs italic text-muted-foreground">
                  {createdDuration}
                </span>
              </div>
              {/* Date. */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-1 text-xs text-muted-foreground md:text-sm">
                  <h5>Date:</h5>
                  <span>
                    {format(
                      new Date(message.createdAt),
                      "LLLL d, yyyy, h:mm aa",
                    )}
                  </span>
                </div>
                {/* Attachment count. */}
                {!!message.attachments && !!message.attachments.length && (
                  <div className="flex items-center text-xs text-emerald-600 md:text-sm">
                    <Paperclip className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    <span>{`${message.attachments.length} ${
                      message.attachments.length === 1 ? "file" : "files"
                    }`}</span>
                  </div>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Separator />
            <div className="my-2 max-w-[88vw] grow-0 space-y-1 pl-6 lg:max-w-[60vw] xl:max-w-[40vw]">
              <h5 className="text-xs text-muted-foreground md:text-sm">
                Message:
              </h5>
              <p className="whitespace-pre-wrap break-words text-sm leading-[1.75rem] md:text-base md:leading-[2rem]">
                {message.content}
              </p>
            </div>
            {message.attachments.length > 0 && (
              <>
                <Separator />
                <div className="mt-2 space-y-2 pl-6">
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
