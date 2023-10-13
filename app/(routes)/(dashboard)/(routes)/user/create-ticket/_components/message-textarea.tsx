import { TicketFormType } from "@/types";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface MessageTextareaProps {
  form: TicketFormType;
  disabled: boolean;
}

export default function MessageTextarea({
  form,
  disabled,
}: MessageTextareaProps) {
  return (
    <div className="px-2">
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="ml-1">Message *</FormLabel>
            <FormControl>
              <Textarea disabled={disabled} className="h-[20rem]" {...field} />
            </FormControl>
            {!field.value && (
              <FormDescription className="italic">
                Provide some more details about your issue.
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
