import { Folder, Globe, Lock } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/shadcn/badge";
import { DCollection } from "@/data/types/domain/collection";
import { MoreOptionsButton } from "../../buttons";

type Props = {
   collection: DCollection;
};

export const CollectionCard = ({ collection }: Props) => {
   const iconColor = collection.color;

   return (
      <div
         className="group relative flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
         data-testid="collection-item-card"
      >
         {/* Actions Menu – only on hover */}
         <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
            <MoreOptionsButton collection={collection} size="icon-sm" />
         </div>

         {/* Clickable area → collection detail */}
         <Link
            href={`/collections/${collection.id}`}
            className="flex flex-1 flex-col gap-3"
            data-testid="collection-link"
         >
            {/* Icon + Name */}
            <div className="flex items-center gap-3">
               <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${iconColor}20` }}
               >
                  <Folder className="h-5 w-5" style={{ color: iconColor }} />
               </div>
               <div className="min-w-0">
                  <div className="flex items-center gap-1.5" data-testid="name">
                     <span className="truncate font-semibold text-slate-900">
                        {collection.name}
                     </span>
                     {collection.isPublic ? (
                        <Globe className="h-3.5 w-3.5 shrink-0 text-green-600" />
                     ) : (
                        <Lock className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                     )}
                  </div>
               </div>
            </div>

            {/* Description */}
            {collection.description && (
               <p className="line-clamp-2 text-sm text-slate-500">
                  {collection.description}
               </p>
            )}

            {/* Footer: template count */}
            <div className="mt-auto pt-2">
               <Badge variant="secondary" className="text-xs font-normal">
                  {collection.templateCount}{" "}
                  {collection.templateCount === 1 ? "Vorlage" : "Vorlagen"}
               </Badge>
            </div>
         </Link>
      </div>
   );
};
