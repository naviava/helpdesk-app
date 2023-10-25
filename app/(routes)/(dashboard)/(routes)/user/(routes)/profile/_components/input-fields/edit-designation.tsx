"use client";

import { PersonalInfoFormType } from "@/types";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface EditDesignationProps {
  form: PersonalInfoFormType;
  disabled?: boolean;
}

export default function EditDesignation({
  form,
  disabled = false,
}: EditDesignationProps) {
  return (
    <FormField
      control={form.control}
      name="designation"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Designation</FormLabel>
          <FormControl>
            <Input
              placeholder="Your job role"
              disabled={disabled}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
