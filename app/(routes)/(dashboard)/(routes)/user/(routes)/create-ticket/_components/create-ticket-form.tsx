"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { toast } from "sonner";
import { Loader, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PriorityEnum } from "@/types";

import { useEdgeStore } from "@/lib/edgestore";
import { useUploadModal } from "@/hooks/use-upload-modal";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CategoryCombobox from "@/components/ticket-utilities/category-combobox";
import DepartmentCombobox from "@/components/ticket-utilities/department-combobox";
import PriorityRadioButtons from "./priority-radio-buttons";
import MessageTextarea from "./message-textarea";
import TitleInput from "./title-input";

import { cn } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title cannot be empty" })
    .max(50, { message: "Maximum 50 characters" }),
  categoryId: z.string().nullish(),
  departmentId: z.string().nullish(),
  priority: PriorityEnum,
  message: z.string().min(3, { message: "Briefly explain your issue" }),
  attachmentUrl: z.array(z.string()).nullish(),
});

export default function CreateTicketForm() {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const { onOpen: openUploadModal, urlList, clearUrlList } = useUploadModal();

  const { data: categories } = trpc.list.getTicketCategories.useQuery();
  const { data: departments } = trpc.list.getDepartments.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      departmentId: "",
      priority: "LOW",
      message: "",
      attachmentUrl: [],
    },
  });

  const { isValid } = useMemo(() => form.formState, [form.formState]);

  const confirmFiles = useCallback(async () => {
    for (const url of urlList) {
      await edgestore.publicFiles.confirmUpload({ url });
    }
  }, [edgestore.publicFiles, urlList]);

  const { mutate: createTicket, isLoading } =
    trpc.ticket.createTicket.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: async () => {
        form.reset();

        confirmFiles();
        clearUrlList();

        router.push("/user/tickets");
        toast.success("Ticket created");
      },
    });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) =>
      createTicket({ ...values, attachmentUrl: urlList }),
    [createTicket, urlList],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mt-8 max-w-4xl space-y-8 lg:mt-10"
      >
        <TitleInput form={form} disabled={isLoading} />
        <div className="space-y-8 px-2 md:flex md:items-center md:gap-20 md:space-y-0">
          <CategoryCombobox
            form={form}
            disabled={isLoading}
            options={categories?.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
          <DepartmentCombobox
            form={form}
            disabled={isLoading}
            options={departments?.map((dept) => ({
              label: dept.name,
              value: dept.id,
            }))}
          />
        </div>
        <PriorityRadioButtons form={form} disabled={isLoading} />
        <MessageTextarea form={form} disabled={isLoading} />
        <div
          className={cn(
            "flex -translate-y-7 px-2",
            !form.getValues("message") ? "justify-between" : "justify-end",
          )}
        >
          {!form.getValues("message") && (
            <span className="text-sm italic text-muted-foreground">
              Please provide some details regarding your issue
            </span>
          )}
          {urlList.length === 0 ? (
            <div
              role="button"
              onClick={openUploadModal}
              className="text-sm text-blue-700 underline"
            >
              Click here to attach files...
            </div>
          ) : (
            <div className="flex flex-col">
              <p className="ml-auto text-sm italic text-muted-foreground">{`${
                urlList.length
              } ${urlList.length === 1 ? "file" : "files"} attached`}</p>
              <div
                role="button"
                onClick={clearUrlList}
                className="flex items-center py-1 text-rose-500"
              >
                <X className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                <span className="text-sm font-light md:text-base">
                  Clear attachments
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="ml-auto w-fit px-2">
          <Button
            type="submit"
            variant="theme"
            disabled={!isValid || isLoading}
            className="w-[10rem] disabled:cursor-not-allowed"
          >
            {!isLoading ? (
              "Create Ticket"
            ) : (
              <Loader className="h-5 w-5 animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
