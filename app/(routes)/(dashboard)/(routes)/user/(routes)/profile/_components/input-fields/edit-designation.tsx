"use client";

import { Box } from "lucide-react";

import { PersonalInfoFormType } from "@/types";

import { Input } from "@/components/ui/input";
import {
  FormControl,
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
          <FormLabel className="flex items-center text-muted-foreground">
            <Box className="mr-2 h-5 w-5" />
            Designation
          </FormLabel>
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
