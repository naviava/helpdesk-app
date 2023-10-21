import { TicketFormType } from "@/types";

import { Combobox } from "@/components/combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface DepartmentComboboxProps {
  form: TicketFormType;
  options: { label: string; value: string }[] | undefined;
  disabled: boolean;
}

export default function DepartmentCombobox({
  form,
  options,
  disabled,
}: DepartmentComboboxProps) {
  return (
    <div className="md:flex-1">
      <FormField
        control={form.control}
        name="departmentId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Department</FormLabel>
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
