import { Search } from "lucide-react";

export const ExploreEmptyState = () => {
   return (
      <div
         className="flex flex-col items-center justify-center py-24 text-center"
         data-testid="explore-empty-state"
      >
         <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Search className="h-8 w-8 text-slate-400" />
         </div>
         <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Keine Vorlagen gefunden
         </h3>
         <p className="mt-2 max-w-sm text-sm text-slate-500">
            Versuche andere Suchbegriffe oder entferne die aktiven Filter.
         </p>
      </div>
   );
};
