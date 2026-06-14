"use client";

import { useMemo, useState } from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { flatMap, isEmpty } from "es-toolkit/compat";
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
import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { Page } from "@/data/types/common";
import { DPrompt } from "@/data/types/domain/prompt";
import { cn } from "@/lib/utils";

type LoadableValue = {
   id: string;
   title: string;
};

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   placeholder: string;
   required?: boolean;
   className?: string;
   control: Control<T>;
   loadData: <P>(
      v: P
   ) => UseInfiniteQueryResult<InfiniteData<Page<LoadableValue>>, Error>;
};

export const FormSelectLoadableValues = <T extends FieldValues>({
   name,
   label,
   placeholder,
   required,
   className,
   control,
   loadData,
}: Props<T>) => {
   const { field } = useController({ name, control });

   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = loadData(
      {}
   );

   const items = useMemo(
      () => flatMap(data?.pages, (page) => page.content),
      [data]
   );

   const [open, setOpen] = useState(false);
   const selected = items.find((t) => t.id === field.value);

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
                        <InfiniteScroll
                           hasMore={hasNextPage}
                           isLoading={isFetching}
                           next={fetchNextPage}
                           threshold={0.1}
                        >
                           {items.map((item) => {
                              return (
                                 <LoadedCommandItem
                                    key={item.id}
                                    item={item}
                                    isSelected={field.value === item.id}
                                    onSelect={() => {
                                       field.onChange(item.id);
                                       setOpen(false);
                                    }}
                                 />
                              );
                           })}
                        </InfiniteScroll>
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
         <FormMessage />
      </FormItem>
   );
};

type CommandItemProps = {
   item: LoadableValue;
   isSelected: boolean;
   onSelect: () => void;
   ref?: React.Ref<HTMLDivElement>;
};

const LoadedCommandItem = ({
   item,
   isSelected,
   onSelect,
   ref,
}: CommandItemProps) => {
   return (
      <CommandItem
         ref={ref}
         key={item.id}
         value={item.title}
         onSelect={onSelect}
      >
         <Check
            className={cn(
               "mr-2 h-4 w-4",
               isSelected ? "opacity-100" : "opacity-0"
            )}
         />
         {item.title}
      </CommandItem>
   );
};
