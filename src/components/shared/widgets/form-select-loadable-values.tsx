"use client";

import { useMemo, useState } from "react";
import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   useInfiniteQuery,
} from "@tanstack/react-query";
import { flatMap } from "es-toolkit/compat";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
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
import { cn } from "@/lib/utils";

type LoadedItem = {
   id: string;
   title: string;
};

type LoadedItemInfiniteOption = UndefinedInitialDataInfiniteOptions<
   Page<LoadedItem>,
   Error,
   InfiniteData<Page<LoadedItem>>,
   QueryKey,
   number
>;

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   placeholder: string;
   required?: boolean;
   className?: string;
   control: Control<T>;
   queryOptions: (search: string) => LoadedItemInfiniteOption;
};

export const FormSelectLoadableValues = <T extends FieldValues>({
   name,
   label,
   placeholder,
   required,
   className,
   control,
   queryOptions,
}: Props<T>) => {
   const [open, setOpen] = useState(false);
   const [search, setSearch] = useState("");

   const { field } = useController({ name, control });

   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteQuery(queryOptions(search));

   const items = useMemo(
      () => flatMap(data?.pages, (page) => page.content),
      [data]
   );
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
                     data-testid="item-select"
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
                  <CommandInput
                     placeholder={placeholder}
                     value={search}
                     onValueChange={setSearch}
                     data-testid="search-input"
                  />
                  <CommandList>
                     <SelectCommandEmpty isLoading={isLoading} />
                     <CommandGroup>
                        <InfiniteScroll
                           hasMore={hasNextPage}
                           isLoading={isFetching}
                           next={fetchNextPage}
                           threshold={0.1}
                        >
                           {items.map((item) => {
                              return (
                                 <SelectCommandItem
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

type SelectCommandItemProps = {
   item: LoadedItem;
   isSelected: boolean;
   onSelect: () => void;
   ref?: React.Ref<HTMLDivElement>;
};

export const SelectCommandItem = ({
   item,
   isSelected,
   onSelect,
   ref,
}: SelectCommandItemProps) => {
   return (
      <CommandItem
         ref={ref}
         key={item.id}
         value={item.title}
         onSelect={onSelect}
         data-testid="command-item"
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

type SelectCommandEmptyProps = {
   isLoading: boolean;
};

export const SelectCommandEmpty = ({ isLoading }: SelectCommandEmptyProps) => {
   if (isLoading) {
      return (
         <CommandEmpty data-testid="command-empty-loading">
            <Loader className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
         </CommandEmpty>
      );
   }
   return (
      <CommandEmpty data-testid="command-empty">
         Kein Prompt gefunden.
      </CommandEmpty>
   );
};
