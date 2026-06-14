"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/shadcn/command";
import {
   FormControl,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { DPrompt } from "@/data/types/domain/prompt";
import { cn } from "@/lib/utils";

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   placeholder: string;
   required?: boolean;
   className?: string;
   control: Control<T>;
   prompts: DPrompt[];
};

export const FormSelectLoadableValues = <T extends FieldValues>({
   name,
   label,
   placeholder,
   required,
   className,
   control,
   prompts,
}: Props<T>) => {
   const { field } = useController({ name, control });

   const [open, setOpen] = useState(false);
   const selected = prompts.find((t) => t.id === field.value);

   const renderlabel = () => {
      if (required) {
         return (
            <FormLabel className="gap-1">
               {label}
               <span className="text-destructive">*</span>
            </FormLabel>
         );
      }
      return <FormLabel>{label}</FormLabel>;
   };

   return (
      <FormItem>
         {renderlabel()}
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild={true}>
               <FormControl>
                  <Button
                     variant="outline"
                     role="combobox"
                     aria-expanded={open}
                     className="w-full justify-between font-normal"
                     data-testid="template-select"
                  >
                     <span className="truncate">
                        {selected ? selected.title : "Prompt auswählen…"}
                     </span>
                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
               </FormControl>
            </PopoverTrigger>
            <PopoverContent
               className="p-0"
               align="start"
               style={{
                  width: "var(--radix-popover-trigger-width)",
               }}
            >
               <Command>
                  <CommandInput placeholder={placeholder} />
                  <CommandList>
                     <CommandEmpty>Kein Prompt gefunden.</CommandEmpty>
                     <CommandGroup>
                        {prompts.map((p) => (
                           <CommandItem
                              key={p.id}
                              value={p.title}
                              onSelect={() => {
                                 field.onChange(p.id);
                                 setOpen(false);
                              }}
                           >
                              <Check
                                 className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === p.id
                                       ? "opacity-100"
                                       : "opacity-0"
                                 )}
                              />
                              {p.title}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
         <FormMessage />
      </FormItem>
   );
};
