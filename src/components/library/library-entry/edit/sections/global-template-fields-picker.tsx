"use client";

import { FC, useState } from "react";
import { filter, map } from "es-toolkit/compat";
import { Braces, Check, Search } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

const FIELD_TYPE_LABELS: Record<string, string> = {
   TEXT: "Text",
   TEXTAREA: "Textarea",
   EMAIL: "E-Mail",
   NUMBER: "Nummer",
   DATE: "Datum",
   SELECT: "Auswahl",
   CHECKBOX: "Checkbox",
   RADIO: "Radio",
};

type Props = {
   globalFields: DGlobalTemplateField[];
   selectedGlobalFieldIds: string[];
   onAddFields: (ids: string[]) => void;
};

export const GlobalTemplateFieldsPicker: FC<Props> = ({
   globalFields,
   selectedGlobalFieldIds,
   onAddFields,
}) => {
   const [open, setOpen] = useState(false);
   const [search, setSearch] = useState("");
   const [selectedIds, setSelectedIds] = useState<string[]>([]);

   const filtered = filter(
      globalFields,
      (f) =>
         f.name.toLowerCase().includes(search.toLowerCase()) ||
         f.label.toLowerCase().includes(search.toLowerCase())
   );

   const toggleField = (id: string, alreadyAdded: boolean) => {
      if (alreadyAdded) return;
      setSelectedIds((prev) =>
         prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
   };

   const handleAdd = () => {
      onAddFields(selectedIds);
      setSelectedIds([]);
      setOpen(false);
   };

   const handleOpenChange = (o: boolean) => {
      setOpen(o);
      if (!o) {
         setSearch("");
         setSelectedIds([]);
      }
   };

   return (
      <Popover open={open} onOpenChange={handleOpenChange}>
         <PopoverTrigger asChild>
            <Button
               type="button"
               variant="outline"
               size="sm"
               className="cursor-pointer"
               data-testid="aus-bibliothek-btn"
            >
               <Braces className="mr-1 h-4 w-4" />
               Globale Felder
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b p-3">
               <p className="mb-2 text-sm font-medium text-slate-900">
                  Globale Felder importieren
               </p>
               <div className="relative">
                  <Search className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                     placeholder="Suchen..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="h-8 pl-7 text-sm"
                  />
               </div>
            </div>
            <div className="max-h-56 overflow-y-auto">
               {filtered.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-400">
                     Keine Felder gefunden
                  </p>
               ) : (
                  map(filtered, (field) => {
                     const alreadyAdded = selectedGlobalFieldIds.includes(
                        field.id
                     );
                     const isSelected = selectedIds.includes(field.id);
                     return (
                        <button
                           key={field.id}
                           type="button"
                           onClick={() => toggleField(field.id, alreadyAdded)}
                           disabled={alreadyAdded}
                           className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${alreadyAdded ? "cursor-not-allowed bg-slate-50 opacity-50" : "cursor-pointer hover:bg-accent"} ${isSelected ? "bg-accent" : ""} `}
                           data-testid="global-field-option"
                        >
                           <div className="flex min-w-0 items-center gap-2">
                              {alreadyAdded ? (
                                 <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
                              ) : (
                                 <div
                                    className={`h-3.5 w-3.5 shrink-0 rounded border ${
                                       isSelected
                                          ? "border-primary bg-primary"
                                          : "border-slate-300"
                                    }`}
                                 >
                                    {isSelected && (
                                       <Check className="h-3 w-3 text-primary-foreground" />
                                    )}
                                 </div>
                              )}
                              <span className="truncate font-medium">
                                 {field.label}
                              </span>
                              <code className="shrink-0 font-mono text-xs text-slate-500">
                                 {`{{${field.name}}}`}
                              </code>
                           </div>
                           <Badge
                              variant="secondary"
                              className="ml-2 shrink-0 text-xs"
                           >
                              {FIELD_TYPE_LABELS[field.type] ?? field.type}
                           </Badge>
                        </button>
                     );
                  })
               )}
            </div>
            {selectedIds.length > 0 && (
               <div className="border-t p-3">
                  <Button
                     type="button"
                     size="sm"
                     className="w-full cursor-pointer"
                     onClick={handleAdd}
                  >
                     {selectedIds.length} Feld
                     {selectedIds.length !== 1 ? "er" : ""} hinzufügen
                  </Button>
               </div>
            )}
         </PopoverContent>
      </Popover>
   );
};
