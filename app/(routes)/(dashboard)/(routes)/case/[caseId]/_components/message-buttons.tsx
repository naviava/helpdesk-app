"use client";

import { Mail, Paperclip } from "lucide-react";

import { useUploadModal } from "@/hooks/use-upload-modal";

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
  const { onOpen: openUploadModal, clearUrlList, urlList } = useUploadModal();

  return (
    <>
      <section className="absolute bottom-1 right-2 flex flex-col gap-y-4 md:bottom-2 md:hidden">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Attachment button. */}
              <Button
                type="button"
                variant={
                  !!urlList && urlList.length > 0 ? "destructive" : "theme"
                }
                size="icon"
                onClick={
                  !!urlList && urlList.length > 0
                    ? clearUrlList
                    : openUploadModal
                }
                disabled={isSubmitting}
              >
                {!!urlList && urlList.length > 0 ? (
                  <div className="flex items-center">
                    {urlList.length}
                    <Paperclip className="ml-1 h-3 w-3" />
                  </div>
                ) : (
                  <IconBadge icon={Paperclip} size="lg" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>
                {!!urlList && urlList.length > 0
                  ? "Clear attached files"
                  : "Attach files"}
              </p>
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
              <Button
                type="button"
                variant={
                  !!urlList && urlList.length > 0 ? "destructive" : "theme"
                }
                onClick={
                  !!urlList && urlList.length > 0
                    ? clearUrlList
                    : openUploadModal
                }
                disabled={isSubmitting}
              >
                {!!urlList && urlList.length > 0 ? (
                  <div className="flex items-center text-lg">
                    {urlList.length}
                    <Paperclip className="ml-2 h-4 w-4" />
                  </div>
                ) : (
                  <IconBadge icon={Paperclip} size="lg" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>
                {!!urlList && urlList.length > 0
                  ? "Clear attached files"
                  : "Attach files"}
              </p>
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
