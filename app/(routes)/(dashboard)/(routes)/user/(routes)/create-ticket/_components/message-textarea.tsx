import { TicketFormType } from "@/types";

import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
              <Textarea disabled={disabled} className="h-[15rem]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
