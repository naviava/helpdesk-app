import { TicketFormType } from "@/types";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TitleInputProps {
  form: TicketFormType;
  disabled: boolean;
}

export default function TitleInput({ form, disabled }: TitleInputProps) {
  return (
    <div className="rounded-md bg-slate-200 px-4 py-2 dark:bg-slate-800">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">Ticket Title *</FormLabel>
            <FormControl>
              <Input disabled={disabled} {...field} />
            </FormControl>
            <FormDescription className="italic">
              Brief description of your issue
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
