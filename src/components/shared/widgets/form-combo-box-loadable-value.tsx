"use client";

import { useMemo, useState } from "react";
import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   useInfiniteQuery,
} from "@tanstack/react-query";
import { flatMap, isEmpty, isEqual, some, trim } from "es-toolkit/compat";
import { Check, ChevronsUpDown, Loader, Plus } from "lucide-react";
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
import {
   FormControl,
   FormField,
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

const normalize = (value: string) => trim(value).toLowerCase();

type LoadableValueInfiniteOption = UndefinedInitialDataInfiniteOptions<
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
   required?: boolean;
   className?: string;
   control: Control<T>;
   queryOptions: (search: string) => LoadableValueInfiniteOption;
};

export const FormComboBoxLoadableValue = <T extends FieldValues>({
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
   const [searchFilter, setFilterSearch] = useState("");

   const { field } = useController({ name, control });

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

   const trimmedSearch = trim(search);
   const isFilterSearchDebounced = !isEqual(search, searchFilter);

   const isSelected = (option: string) => {
      return normalize(option) === normalize(field.value ?? "");
   };

   const canCreateNewValue = () => {
      return (
         !isEmpty(trimmedSearch) &&
         !some(options, (o) => normalize(o) === normalize(trimmedSearch)) &&
         !isFilterSearchDebounced &&
         !isFetching
      );
   };

   const canCreate = canCreateNewValue();

   const selectValue = (value: string) => {
      field.onChange(trim(value));
      updateSearch("");
      setOpen(false);
   };

   const renderLabel = () => {
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
            Keine Modelle gefunden.
         </CommandEmpty>
      );
   };

   const renderCreateValue = () => {
      if (!canCreate) {
         return;
      }
      return (
         <>
            <CommandSeparator />
            <CommandGroup heading="Neues Modell">
               <CommandItem
                  value={`__create__${trimmedSearch}`}
                  onSelect={() => selectValue(trimmedSearch)}
                  className="font-medium text-primary data-[selected=true]:text-primary"
                  data-testid="create-option-item"
               >
                  <Plus className="h-4 w-4" />
                  &bdquo;{trimmedSearch}&ldquo; als neues Modell anlegen
               </CommandItem>
            </CommandGroup>
         </>
      );
   };

   return (
      <FormField
         control={control}
         name={name}
         render={() => {
            return (
               <FormItem className={cn(className)} data-testid={name}>
                  {renderLabel()}
                  <Popover open={open} onOpenChange={setOpen}>
                     <PopoverTrigger asChild={true}>
                        <FormControl>
                           <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between font-normal"
                              data-testid="combobox-trigger"
                           >
                              <span
                                 className={cn(
                                    "truncate",
                                    !field.value && "text-muted-foreground"
                                 )}
                              >
                                 {field.value || placeholder}
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
                                    {options.map((option) => {
                                       const selected = isSelected(option);
                                       return (
                                          <CommandItem
                                             key={option}
                                             value={option}
                                             onSelect={() =>
                                                selectValue(option)
                                             }
                                             data-testid="option-item"
                                             data-selected={selected}
                                          >
                                             <Check
                                                className={cn(
                                                   "h-4 w-4",
                                                   selected
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                )}
                                                data-testid="option-item-check"
                                             />
                                             {option}
                                          </CommandItem>
                                       );
                                    })}
                                 </InfiniteScroll>
                              </CommandGroup>
                              {renderCreateValue()}
                           </CommandList>
                        </Command>
                     </PopoverContent>
                  </Popover>
                  <FormMessage />
               </FormItem>
            );
         }}
      />
   );
};
