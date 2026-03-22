import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const ReturnToLibraryButton = () => {
   return (
      <Link
         href="/library"
         className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
         data-testid="return-to-library-btn"
      >
         <ArrowLeft className="h-4 w-4" />
         Zurück zur Bibliothek
      </Link>
   );
};
