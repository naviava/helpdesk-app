"use client";

import { useEffect, useRef } from "react";

import { File, Mail, Paperclip, Send } from "lucide-react";

import { useUploadModal } from "@/hooks/use-upload-modal";

import { Button } from "@/components/ui/button";
import IconBadge from "@/components/icon-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

interface MessageButtonsProps {
  isValid: boolean;
  isSubmitting: boolean;
}

export default function MessageButtons({
  isValid,
  isSubmitting,
}: MessageButtonsProps) {
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const { onOpen: openUploadModal, clearUrlList, urlList } = useUploadModal();

  useEffect(() => {
    function handleKeyDown(evt: KeyboardEvent) {
      if (evt.ctrlKey && evt.key === "Enter") {
        sendButtonRef?.current?.click();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <>
      {/* Attachment button. */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Attachment button. */}
            <div
              role="button"
              onClick={openUploadModal}
              className={cn(
                "absolute inset-y-0 left-0 flex h-[5rem] w-10 flex-col items-center justify-center rounded-l-md md:w-12",
                !urlList.length ? "bg-sky-400" : "bg-emerald-400",
              )}
            >
              {!urlList.length ? (
                <Paperclip className="text-white" />
              ) : (
                <div className="flex flex-col items-center gap-y-1">
                  <File className="text-white" />
                  <p className="text-[10px] text-white md:text-xs">{`${
                    urlList.length
                  } ${urlList.length === 1 ? "file" : "files"}`}</p>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Attach files</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Send button. */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Send button. */}
            <button
              ref={sendButtonRef}
              type="submit"
              disabled={!isValid || isSubmitting}
              className="absolute inset-y-0 right-0 flex h-[5rem] w-10 cursor-pointer items-center justify-center rounded-r-md bg-sky-400 md:w-12"
            >
              <Send className="text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Send message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
