"use client";

import { User } from "lucide-react";

import { PersonalInfoSchemaType } from "../personal-info";

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
  form: PersonalInfoSchemaType | any | undefined;
  disabled?: boolean;
}

export default function EditName({ form, disabled = false }: EditNameProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center text-muted-foreground">
            <User className="mr-2 h-5 w-5" />
            Name
          </FormLabel>
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
