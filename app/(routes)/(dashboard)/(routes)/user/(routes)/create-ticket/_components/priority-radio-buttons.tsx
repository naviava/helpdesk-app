import { Fragment, useMemo } from "react";

import { RadioGroup, Radio } from "@nextui-org/react";

import { TicketFormType } from "@/types";
import { Priority } from "@prisma/client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

interface PriorityRadioButtonsProps {
  form: TicketFormType;
  disabled: boolean;
}

export default function PriorityRadioButtons({
  form,
  disabled,
}: PriorityRadioButtonsProps) {
  const priorityArray = useMemo(() => Object.values(Priority), []);

  return (
    <div className="space-y-4 rounded-md bg-slate-200 px-4 py-2 md:flex md:items-center md:justify-between md:space-x-4 md:space-y-0">
      <h3 className="mr-20 whitespace-nowrap text-[14px]">Priority *</h3>
      <FormField
        control={form.control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                isDisabled={disabled}
                onValueChange={field.onChange}
                defaultValue={field.value}
                orientation="horizontal"
                color="primary"
              >
                <div className="grid grid-cols-4 gap-4 lg:grid-cols-8">
                  {priorityArray.map((prio) => (
                    <Fragment key={prio}>
                      <FormItem className="flex items-center gap-x-1 space-y-0">
                        <FormControl>
                          <Radio value={prio} />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {prio.toLowerCase()}
                        </FormLabel>
                      </FormItem>
                      <Separator />
                    </Fragment>
                  ))}
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
