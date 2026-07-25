"use client";

import { useMemo, useState } from "react";
import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   useInfiniteQuery,
} from "@tanstack/react-query";
import {
   filter,
   find,
   flatMap,
   isArray,
   isEmpty,
   isEqual,
   map,
   some,
   trim,
} from "es-toolkit/compat";
import { Check, ChevronsUpDown, Loader, Plus, X } from "lucide-react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

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
   queryOptions: (search: string) => LoadableValuesInfiniteOption;
};

export const FormComboBoxLoadableValues = <T extends FieldValues>({
   name,
   label,
   placeholder,
   className,
   control,
   queryOptions,
}: Props<T>) => {
   const [open, setOpen] = useState(false);
   const [search, setSearch] = useState("");
   const [searchFilter, setFilterSearch] = useState("");

   const { field, fieldState } = useController({ name, control });

   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteQuery(queryOptions(searchFilter));

   const options = useMemo(
      () => flatMap(data?.pages, (page) => page.content),
      [data]
   );

   const updateSearch = (value: string) => {
      setSearch(value);
      updateFilterSearch(value);
   };

   const updateFilterSearch = useDebouncedCallback((value: string) => {
      setFilterSearch(value);
   }, 300);

   const values: string[] = field.value ?? [];

   const trimmedSearch = trim(search);
   const isFilterSearchDebounced = !isEqual(search, searchFilter);

   const isSelected = (value: string) => {
      return some(values, (v) => normalize(v) === normalize(value));
   };

   const canCreateNewValue = () => {
      return (
         !isEmpty(trimmedSearch) &&
         !some(options, (o) => normalize(o) === normalize(trimmedSearch)) &&
         !isSelected(trimmedSearch) &&
         !isFilterSearchDebounced &&
         !isFetching
      );
   };

   const canCreate = canCreateNewValue();

   const addValue = (value: string) => {
      const newValue = trim(value);
      field.onChange([...values, newValue]);
      setSearch("");
   };

   const removeValue = (value: string) => {
      field.onChange(filter(values, (v) => normalize(v) !== normalize(value)));
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
            {map(values, (value, idx) => (
               <div
                  key={idx}
                  className="flex flex-wrap items-center gap-2 rounded-full bg-slate-100 px-3 py-1"
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

   const renderFieldError = () => {
      const { error } = fieldState;

      const message = isArray(error)
         ? find(error, (e) => !isEmpty(e?.message))?.message
         : error?.message;

      if (!message) {
         return;
      }
      return (
         <p className="text-sm text-destructive" data-testid="field-error">
            {message}
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
                     onValueChange={updateSearch}
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
         {renderFieldError()}
      </FormItem>
   );
};
