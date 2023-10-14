"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PriorityEnum } from "@/types";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PriorityRadioButtons from "./priority-radio-buttons";
import DepartmentCombobox from "./department-combobox";
import CategoryCombobox from "./category-combobox";
import MessageTextarea from "./message-textarea";
import AttachmentInput from "./attachment-input";
import TitleInput from "./title-input";

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
  attachmentUrl: z.string().nullish(),
});

export default function CreateTicketForm() {
  const router = useRouter();

  const { data: categories } = trpc.getTicketCategories.useQuery();
  const { data: departments } = trpc.getDepartments.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      departmentId: "",
      priority: "LOW",
      message: "",
      attachmentUrl: "",
    },
  });

  const { isValid } = useMemo(() => form.formState, [form.formState]);

  const { mutate: createTicket, isLoading } = trpc.createTicket.useMutation({
    onError: ({ message }) => toast.error(message),
    onSuccess: () => {
      form.reset();
      router.push("/user/tickets");
      toast.success("Ticket created");
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => createTicket(values),
    [createTicket],
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
        <AttachmentInput form={form} />
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
