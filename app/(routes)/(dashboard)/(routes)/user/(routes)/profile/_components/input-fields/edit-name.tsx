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

interface EditNameProps {
  form: PersonalInfoFormType;
  disabled?: boolean;
}

export default function EditName({ form, disabled = false }: EditNameProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter your name"
              disabled={disabled}
              {...field}
              value={field.value}
            />
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
