import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface MessageTextareaProps {
  form: UseFormReturn<
    {
      title: string;
      message: string;
      priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      category?: string | null | undefined;
      department?: string | null | undefined;
      attachment?: string | null | undefined;
    },
    any,
    undefined
  >;
}

export default function MessageTextarea({ form }: MessageTextareaProps) {
  return (
    <div className="px-2">
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="ml-1">Message *</FormLabel>
            <FormControl>
              <Textarea className="h-[20rem]" {...field} />
            </FormControl>
            <FormDescription className="italic">
              Provide some more details about your issue.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
