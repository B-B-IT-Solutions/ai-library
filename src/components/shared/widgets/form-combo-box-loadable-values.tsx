"use client";

import { useMemo, useState } from "react";
import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   useInfiniteQuery,
} from "@tanstack/react-query";
import { filter, flatMap, isEmpty, map, some, trim } from "es-toolkit/compat";
import { Check, ChevronsUpDown, Loader, Plus, X } from "lucide-react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from "@/components/shadcn/command";
import { FormItem, FormLabel } from "@/components/shadcn/form";
import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { Page } from "@/data/types/common";
import { cn } from "@/lib/utils";

const DEFAULT_MAX_ITEMS = 5;
const MAX_VALUE_LENGTH = 50;

const normalize = (value: string) => trim(value).toLowerCase();

type LoadableValuesInfiniteOption = UndefinedInitialDataInfiniteOptions<
   Page<string>,
   Error,
   InfiniteData<Page<string>>,
   QueryKey,
   number
>;

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   placeholder: string;
   className?: string;
   control: Control<T>;
   maxItems?: number;
   queryOptions: (search: string) => LoadableValuesInfiniteOption;
};

export const FormComboBoxLoadableValues = <T extends FieldValues>({
   name,
   label,
   placeholder,
   className,
   control,
   maxItems = DEFAULT_MAX_ITEMS,
   queryOptions,
}: Props<T>) => {
   const [open, setOpen] = useState(false);
   const [search, setSearch] = useState("");
   const { field } = useController({ name, control });

   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteQuery(queryOptions(search));

   const options = useMemo(
      () => flatMap(data?.pages, (page) => page.content),
      [data]
   );

   const values: string[] = field.value ?? [];
   const trimmedSearch = trim(search);
   const isAtLimit = values.length >= maxItems;

   const isSelected = (value: string) =>
      values.some((v: string) => normalize(v) === normalize(value));

   const canCreateNewCategorey = () => {
      return (
         !isEmpty(trimmedSearch) &&
         trimmedSearch.length <= MAX_VALUE_LENGTH &&
         !some(
            options,
            (option: string) => normalize(option) === normalize(trimmedSearch)
         ) &&
         !isSelected(trimmedSearch)
      );
   };

   const canCreate = canCreateNewCategorey();

   const addValue = (value: string) => {
      const newValue = trim(value);
      if (isEmpty(newValue) || isAtLimit || isSelected(newValue)) {
         return;
      }
      field.onChange([...values, newValue.slice(0, MAX_VALUE_LENGTH)]);
      setSearch("");
   };

   const removeValue = (value: string) => {
      field.onChange(
         filter(values, (v: string) => normalize(v) !== normalize(value))
      );
   };

   const toggleValue = (value: string) => {
      if (isSelected(value)) {
         removeValue(value);
      } else {
         addValue(value);
      }
   };

   const renderChips = () => {
      if (isEmpty(values)) {
         return;
      }
      return (
         <div className="flex flex-wrap gap-2" data-testid="current-values">
            {map(values, (value: string, idx: number) => (
               <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1"
               >
                  <span className="text-sm">{value}</span>
                  <button
                     type="button"
                     onClick={() => removeValue(value)}
                     className="cursor-pointer text-slate-500 hover:text-slate-700"
                     data-testid="remove-value-btn"
                  >
                     <X className="h-3 w-3" />
                  </button>
               </div>
            ))}
         </div>
      );
   };

   const renderEmpty = () => {
      if (canCreate || !isEmpty(options)) {
         return;
      }
      if (isLoading) {
         return (
            <CommandEmpty data-testid="command-empty-loading">
               <Loader className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
            </CommandEmpty>
         );
      }
      return (
         <CommandEmpty data-testid="command-empty">
            Keine Kategorien gefunden.
         </CommandEmpty>
      );
   };

   const renderCreateOption = () => {
      if (!canCreate) {
         return;
      }
      return (
         <>
            <CommandSeparator />
            <CommandGroup heading="Neue Kategorie">
               <CommandItem
                  value={`__create__${trimmedSearch}`}
                  onSelect={() => addValue(trimmedSearch)}
                  className="font-medium text-primary data-[selected=true]:text-primary"
                  data-testid="create-option-item"
               >
                  <Plus className="h-4 w-4" />
                  &bdquo;{trimmedSearch}&ldquo; als neue Kategorie anlegen
               </CommandItem>
            </CommandGroup>
         </>
      );
   };

   const renderLimitHint = () => {
      if (!isAtLimit) {
         return;
      }
      return (
         <p className="text-xs text-slate-500" data-testid="limit-hint">
            Maximal {maxItems} Kategorien pro Prompt
         </p>
      );
   };

   return (
      <FormItem className={cn(className)} data-testid={name}>
         <FormLabel>{label}</FormLabel>
         {renderChips()}
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild={true}>
               <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={isAtLimit}
                  className="w-full justify-between font-normal"
                  data-testid="combobox-trigger"
               >
                  <span className="truncate text-muted-foreground">
                     {placeholder}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="p-0"
               align="start"
               style={{
                  width: "var(--radix-popover-trigger-width)",
               }}
            >
               <Command shouldFilter={false}>
                  <CommandInput
                     placeholder={placeholder}
                     value={search}
                     onValueChange={setSearch}
                     data-testid="search-input"
                  />
                  <CommandList>
                     {renderEmpty()}
                     <CommandGroup>
                        <InfiniteScroll
                           hasMore={hasNextPage}
                           isLoading={isFetching}
                           next={fetchNextPage}
                           threshold={0.1}
                        >
                           {map(options, (option) => {
                              const selected = isSelected(option);
                              return (
                                 <CommandItem
                                    key={option}
                                    value={option}
                                    onSelect={() => toggleValue(option)}
                                    data-testid="option-item"
                                    data-selected={selected}
                                 >
                                    <Check
                                       className={cn(
                                          "h-4 w-4",
                                          selected ? "opacity-100" : "opacity-0"
                                       )}
                                       data-testid="option-item-check"
                                    />
                                    {option}
                                 </CommandItem>
                              );
                           })}
                        </InfiniteScroll>
                     </CommandGroup>
                     {renderCreateOption()}
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
         {renderLimitHint()}
      </FormItem>
   );
};
