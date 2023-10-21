import { TicketFormType } from "@/types";

import { Combobox } from "@/components/combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CategoryComboboxProps {
  form: TicketFormType;
  options: { label: string; value: string }[] | undefined;
  disabled: boolean;
}

export default function CategoryCombobox({
  form,
  options,
  disabled,
}: CategoryComboboxProps) {
  return (
    <div className="md:flex-1">
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Combobox options={options} {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
