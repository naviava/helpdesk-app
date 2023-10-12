import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface TitleInputProps {
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

export default function TitleInput({ form }: TitleInputProps) {
  return (
    <div className="rounded-md bg-slate-200 px-4 py-2 dark:bg-slate-800">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">Ticket Title *</FormLabel>
            <FormControl>
              <Input {...field} />
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
