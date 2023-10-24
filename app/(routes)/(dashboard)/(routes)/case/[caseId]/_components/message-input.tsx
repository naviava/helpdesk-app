"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEdgeStore } from "@/lib/edgestore";
import { useUploadModal } from "@/hooks/use-upload-modal";

import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import MessageButtons from "./message-buttons";

import { trpc } from "@/app/_trpc/client";

interface MessageInputProps {}

const formSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty" }),
  ticketId: z.string().min(1),
  attachmentUrl: z.array(z.string()).nullish(),
});

export default function MessageInput({}: MessageInputProps) {
  const router = useRouter();
  const params = useParams<{ caseId: string }>();

  const inputRef = useRef<HTMLDivElement>(null);

  const { edgestore } = useEdgeStore();
  const { onOpen: openUploadModal, urlList, clearUrlList } = useUploadModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      ticketId: params.caseId,
      attachmentUrl: [],
    },
  });

  const { isValid } = useMemo(() => form.formState, [form.formState]);

  const confirmFiles = useCallback(async () => {
    for (const url of urlList) {
      await edgestore.publicFiles.confirmUpload({ url });
    }
  }, [edgestore.publicFiles, urlList]);

  /**
   * TODO: Mutation to create create.
   */
  const { mutate: createMessage, isLoading } =
    trpc.ticket.createMessage.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: async () => {
        form.reset();

        confirmFiles();
        clearUrlList();

        router.refresh();
        toast.success("Message sent");
      },
    });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) =>
      createMessage({ ...values, attachmentUrl: urlList }),
    [createMessage, urlList],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative mt-auto">
                  <Textarea
                    disabled={isLoading}
                    autoComplete="off"
                    placeholder={`Write your message here...\n(Press Ctrl + Enter to send)`}
                    className="resize-none px-12 md:px-14"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        {/* Button group. */}
        <MessageButtons isValid={isValid} isSubmitting={isLoading} />
      </form>
    </Form>
  );
}
