"use client";

import { PersonalInfoFormType } from "@/types";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface EditPhoneNumberProps {
  form: PersonalInfoFormType;
  disabled?: boolean;
}

export default function EditPhoneNumber({
  form,
  disabled = false,
}: EditPhoneNumberProps) {
  return (
    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input
              placeholder="Contact no."
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
