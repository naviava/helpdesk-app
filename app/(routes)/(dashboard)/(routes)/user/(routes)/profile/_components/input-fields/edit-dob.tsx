"use client";

import { Cake } from "lucide-react";

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

interface EditDobProps {
  form: PersonalInfoSchemaType | any | undefined;
  disabled?: boolean;
}

export default function EditDob({ form, disabled = false }: EditDobProps) {
  return (
    <FormField
      control={form.control}
      name="dob"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center text-muted-foreground">
            <Cake className="mr-2 h-5 w-5" />
            Date of Birth
          </FormLabel>
          <FormControl>
            <Input
              placeholder="MM/DD/YYYY"
              disabled={disabled}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormDescription>
            Birth year will not be displayed to public.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
