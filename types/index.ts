import * as z from "zod";
import { UseFormReturn } from "react-hook-form";

import { Priority } from "@prisma/client";

export const PriorityEnum = z.nativeEnum(Priority);
export type PriorityEnumType = z.infer<typeof PriorityEnum>;

export const StatusToggleType = {
  ON_HOLD: "ON_HOLD",
  RESOLVED: "RESOLVED",
  REOPENED: "REOPENED",
} as const;

export const StatusToggleEnum = z.nativeEnum(StatusToggleType);
export type StatusToggleEnum = z.infer<typeof StatusToggleEnum>;

export type TicketFormType = UseFormReturn<
  {
    title: string;
    message: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    categoryId?: string | null | undefined;
    departmentId?: string | null | undefined;
    attachmentUrl?: string[] | null | undefined;
  },
  any,
  undefined
>;

export type PersonalInfoFormType = UseFormReturn<
  {
    name: string;
    designation?: string | null | undefined;
    departmentId?: string | null | undefined;
    dob?: Date | null | undefined;
    phoneNumber?: string | null | undefined;
  },
  any,
  undefined
>;
