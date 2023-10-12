import { useState } from "react";

import { UseFormReturn } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";

interface CategoryComboboxProps {
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

export default function CategoryCombobox({ form }: CategoryComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories } = trpc.getTicketCategories.useQuery();

  return (
    <div className="md:flex-1">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Category</FormLabel>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value
                      ? categories?.find(
                          (category) => category.name === field.value,
                        )?.name
                      : "Select category"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-full p-0 ">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {categories?.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => {
                          form.setValue("category", category.name);
                          setIsOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            category.name === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {category?.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
