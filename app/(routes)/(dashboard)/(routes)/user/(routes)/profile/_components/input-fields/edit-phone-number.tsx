"use client";

import { Phone } from "lucide-react";

import { PersonalInfoFormType } from "../personal-info";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface EditPhoneNumberProps {
  form: PersonalInfoFormType | any | undefined;
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
          <FormLabel className="flex items-center text-muted-foreground">
            <Phone className="mr-2 h-5 w-5" />
            Phone Number
          </FormLabel>
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
