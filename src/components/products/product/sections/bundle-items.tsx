import { Folder } from "lucide-react";

import { DProductItem } from "@/data/types/domain/product";

interface Props {
   items: DProductItem[];
   groupByCategory?: boolean;
}

export const BundleItems = ({ items }: Props) => {
   return (
      <section className="space-y-3" data-testid="bundle-items">
         <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Folder className="h-5 w-5 text-indigo-600" />
            Enthaltene Vorlagen ({items.length})
         </h3>
      </section>
   );
};
