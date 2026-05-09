import { isEmpty, map } from "es-toolkit/compat";
import { Copy, Cpu, Info, LayoutList, Tag } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import {
   DCatalogEntry,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import { DPromptTemplateFieldType } from "@/data/types/domain/prompt.template";
import {
   AddCatalogEntryToLibraryButton,
   UseCatalogEntryButton,
} from "../../buttons";

const FIELD_TYPE_LABELS: Record<DPromptTemplateFieldType, string> = {
   TEXT: "Text",
   TEXTAREA: "Mehrzeiliger Text",
   SELECT: "Auswahl",
   CHECKBOX: "Checkbox",
   RADIO: "Radio-Auswahl",
   NUMBER: "Zahl",
   DATE: "Datum",
   EMAIL: "E-Mail",
};

type Props = {
   entry: DCatalogEntryWithContent;
   isAuthenticated: boolean;
   relatedEntries: DCatalogEntry[];
};

export const CatalogEntryView = ({
   entry,
   isAuthenticated,
   relatedEntries,
}: Props) => {
   const header = () => {
      const { title, description, category, recommendedModel, copyCount } =
         entry;
      return (
         <div className="space-y-4" data-testid="header">
            <div className="flex flex-wrap gap-2">
               {category && (
                  <Badge
                     variant="secondary"
                     className="flex items-center gap-1"
                  >
                     <Tag className="h-3 w-3" />
                     {category.name}
                  </Badge>
               )}
               <Badge variant="outline" className="flex items-center gap-1">
                  <Cpu className="h-3 w-3" />
                  {recommendedModel}
               </Badge>
               {copyCount > 0 && (
                  <Badge
                     variant="outline"
                     className="flex items-center gap-1 text-slate-500"
                  >
                     <Copy className="h-3 w-3" />
                     {copyCount}× übernommen
                  </Badge>
               )}
            </div>

            <div>
               <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {title}
               </h1>
               <p className="mt-2 text-base text-slate-600">{description}</p>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
               <UseCatalogEntryButton entry={entry} />
               <AddCatalogEntryToLibraryButton
                  entry={entry}
                  isAuthenticated={isAuthenticated}
               />
            </div>
         </div>
      );
   };

   const fields = () => {
      const { fields } = entry;
      if (!isEmpty(fields)) {
         return (
            <div className="space-y-4" data-testid="fields">
               <div className="flex items-center gap-2">
                  <LayoutList className="h-5 w-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-900">
                     Formularfelder ({fields.length})
                  </h2>
               </div>
               <p className="text-sm text-slate-500">
                  Diese Vorlage hat strukturierte Felder, die du nach dem
                  Übernehmen befüllen kannst.
               </p>

               <div className="space-y-3">
                  {fields.map((field) => (
                     <Card
                        key={field.id}
                        className="border-slate-200"
                        data-testid="field"
                     >
                        <CardHeader className="pb-2">
                           <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-sm font-semibold text-slate-800">
                                 {field.label}
                                 {field.required && (
                                    <span className="ml-1 text-red-500">*</span>
                                 )}
                              </CardTitle>
                              <Badge
                                 variant="outline"
                                 className="shrink-0 text-xs font-normal"
                              >
                                 {FIELD_TYPE_LABELS[field.type]}
                              </Badge>
                           </div>
                           {field.description && (
                              <CardDescription className="text-xs">
                                 {field.description}
                              </CardDescription>
                           )}
                        </CardHeader>
                        {!isEmpty(field.options) && (
                           <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-1.5">
                                 {map(field.options, (opt) => (
                                    <Badge
                                       key={opt}
                                       variant="secondary"
                                       className="text-xs font-normal"
                                    >
                                       {opt}
                                    </Badge>
                                 ))}
                              </div>
                           </CardContent>
                        )}
                     </Card>
                  ))}
               </div>
            </div>
         );
      }
   };

   const relatedPrompts = () => {
      if (!isEmpty(relatedEntries)) {
         return (
            <>
               <Separator />
               <div className="space-y-4" data-testid="related-entries">
                  <h2 className="text-lg font-semibold text-slate-900">
                     Mehr aus dieser Kategorie
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                     {map(relatedEntries, (related) => (
                        <a
                           key={related.id}
                           href={`/explore/${related.slug}`}
                           className="group rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
                           data-testid="related-entry"
                        >
                           <h3 className="font-medium text-slate-900 group-hover:text-slate-700">
                              {related.title}
                           </h3>
                           <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                              {related.description}
                           </p>
                        </a>
                     ))}
                  </div>
               </div>
            </>
         );
      }
   };

   const cta = () => {
      return (
         <div
            className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center"
            data-testid="cta"
         >
            <div className="flex justify-center">
               <Info className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-2 text-sm font-medium text-slate-700">
               Übernimm diese Vorlage in deine persönliche Library
            </p>
            <p className="mt-1 text-xs text-slate-500">
               Die Kopie gehört dir – du kannst sie beliebig anpassen.
            </p>
            <div className="mt-4 flex justify-center gap-3">
               <UseCatalogEntryButton entry={entry} />
               <AddCatalogEntryToLibraryButton
                  entry={entry}
                  isAuthenticated={isAuthenticated}
               />
            </div>
         </div>
      );
   };

   return (
      <div
         className="mx-auto max-w-3xl space-y-8"
         data-testid="catalog-entry-view"
      >
         {header()}

         <Separator />

         {fields()}

         {relatedPrompts()}

         {cta()}
      </div>
   );
};
