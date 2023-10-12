"use client";

import { useCallback, useMemo } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PriorityRadioButtons from "./priority-radio-buttons";
import DepartmentCombobox from "./department-combobox";
import CategoryCombobox from "./category-combobox";
import MessageTextarea from "./message-textarea";
import AttachmentInput from "./attachment-input";
import TitleInput from "./title-input";

import { Priority } from "@prisma/client";

const PriorityEnum = z.nativeEnum(Priority);
type PriorityEnum = z.infer<typeof PriorityEnum>;

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title cannot be empty" })
    .max(50, { message: "Maximum 50 characters" }),
  category: z.string().nullish(),
  department: z.string().nullish(),
  priority: PriorityEnum,
  message: z.string().min(3, { message: "Briefly explain your issue" }),
  attachment: z.string().nullish(),
});

export default function CreateTicketForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      department: "",
      priority: "LOW",
      message: "",
      attachment: "",
    },
  });

  const { isValid } = useMemo(() => form.formState, [form.formState]);

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    console.log(values);
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mt-6 max-w-4xl space-y-8"
      >
        <TitleInput form={form} />
        <div className="space-y-8 px-2 md:flex md:items-center md:gap-20 md:space-y-0">
          <CategoryCombobox form={form} />
          <DepartmentCombobox form={form} />
        </div>
        <PriorityRadioButtons form={form} />
        <MessageTextarea form={form} />
        <AttachmentInput form={form} />
        <div className="ml-auto w-fit">
          <Button
            type="submit"
            variant="theme"
            disabled={!isValid}
            className="disabled:cursor-not-allowed"
          >
            Create Ticket
          </Button>
        </div>
      </form>
    </Form>
  );
}
