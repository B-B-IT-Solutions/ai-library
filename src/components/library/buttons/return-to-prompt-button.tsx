import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
   entryId: string;
};

export const ReturnToPromptButton = ({ entryId }: Props) => {
   return (
      <Link
         href={`/library/${entryId}`}
         className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
         data-testid="return-to-prompt-btn"
      >
         <ArrowLeft className="h-4 w-4" />
         Zurück zur Vorlage
      </Link>
   );
};
