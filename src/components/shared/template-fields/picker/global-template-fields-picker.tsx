"use client";

import { useState } from "react";
import { filter, includes, isEmpty, map } from "es-toolkit/compat";
import { Braces, Search } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

import { GlobalTemplateFieldOption } from "./global-template-field-option";

type Props = {
   globalFields: DGlobalTemplateField[];
   selectedGlobalFieldIds: string[];
   onAddFields: (ids: string[]) => void;
};

export const GlobalTemplateFieldsPicker = ({
   globalFields,
   selectedGlobalFieldIds,
   onAddFields,
}: Props) => {
   const [open, setOpen] = useState(false);
   const [search, setSearch] = useState("");
   const [selectedIds, setSelectedIds] = useState<string[]>([]);

   const filtered = filter(
      globalFields,
      (f) =>
         includes(f.name.toLowerCase(), search.toLowerCase()) ||
         includes(f.label.toLowerCase(), search.toLowerCase())
   );

   const toggleField = (id: string, alreadyAdded: boolean) => {
      if (!alreadyAdded) {
         setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
         );
      }
   };

   const handleAdd = () => {
      onAddFields(selectedIds);
      setSelectedIds([]);
      setOpen(false);
   };

   const handleOpenChange = (o: boolean) => {
      console.log(o);
      setOpen(o);
      if (!o) {
         setSearch("");
         setSelectedIds([]);
      }
   };

   const renderField = (field: DGlobalTemplateField) => {
      const alreadyAdded = selectedGlobalFieldIds.includes(field.id);
      const isSelected = selectedIds.includes(field.id);
      return (
         <GlobalTemplateFieldOption
            key={field.id}
            field={field}
            onToggle={toggleField}
            alreadyAdded={alreadyAdded}
            isSelected={isSelected}
         />
      );
   };

   const renderFields = () => {
      if (isEmpty(filtered)) {
         return (
            <p
               className="py-6 text-center text-sm text-slate-400"
               data-testid="fields-empty"
            >
               Keine Felder gefunden
            </p>
         );
      }
      return map(filtered, renderField);
   };

   const addFieldsBtn = () => {
      if (!isEmpty(selectedIds)) {
         return (
            <div className="border-t p-3">
               <Button
                  onClick={handleAdd}
                  type="button"
                  size="sm"
                  className="w-full cursor-pointer"
                  data-testid="add-fields-btn"
               >
                  {selectedIds.length} Feld
                  {selectedIds.length !== 1 ? "er" : ""} hinzufügen
               </Button>
            </div>
         );
      }
   };

   return (
      <Popover open={open} onOpenChange={handleOpenChange}>
         <PopoverTrigger asChild={true}>
            <Button
               type="button"
               variant="outline"
               size="sm"
               className="cursor-pointer"
               data-testid="global-template-fields-picker"
            >
               <Braces className="mr-1 h-4 w-4" />
               Globale Felder
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b p-3" data-testid="picker-header">
               <p className="mb-2 text-sm font-medium text-slate-900">
                  Globale Felder importieren
               </p>
               <div className="relative" data-testid="field-search">
                  <Search className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                     placeholder="Suchen..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="h-8 pl-7 text-sm"
                     data-testid="search-input"
                  />
               </div>
            </div>
            <div className="max-h-56 overflow-y-auto" data-testid="fields-list">
               {renderFields()}
            </div>
            {addFieldsBtn()}
         </PopoverContent>
      </Popover>
   );
};
