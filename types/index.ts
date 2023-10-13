import * as z from "zod";
import { UseFormReturn } from "react-hook-form";

import { Priority } from "@prisma/client";

export const PriorityEnum = z.nativeEnum(Priority);
export type PriorityEnumType = z.infer<typeof PriorityEnum>;

export type TicketFormType = UseFormReturn<
  {
    title: string;
    message: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    categoryId?: string | null | undefined;
    departmentId?: string | null | undefined;
    attachmentUrl?: string | null | undefined;
  },
  any,
  undefined
>;
