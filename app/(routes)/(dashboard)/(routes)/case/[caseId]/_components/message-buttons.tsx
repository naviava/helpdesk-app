import { Mail, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import IconBadge from "@/components/icon-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageButtonsProps {
  isValid: boolean;
  isSubmitting: boolean;
}

export default function MessageButtons({
  isValid,
  isSubmitting,
}: MessageButtonsProps) {
  return (
    <>
      <section className="absolute bottom-1 right-2 flex flex-col gap-y-4 md:bottom-2 md:hidden">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Attachment button. */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isSubmitting}
              >
                <IconBadge icon={Paperclip} size="lg" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Attach files</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Send button. */}
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                disabled={!isValid || isSubmitting}
              >
                <IconBadge icon={Mail} size="lg" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>
      <section className="absolute bottom-1 right-2 hidden flex-col gap-y-16 md:bottom-2 md:flex">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Attachment button. */}
              <Button type="button" variant="theme" disabled={isSubmitting}>
                <IconBadge icon={Paperclip} size="lg" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Attach files</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Send button. */}
              <Button
                type="submit"
                variant="theme"
                disabled={!isValid || isSubmitting}
              >
                <IconBadge icon={Mail} size="lg" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>
    </>
  );
}
