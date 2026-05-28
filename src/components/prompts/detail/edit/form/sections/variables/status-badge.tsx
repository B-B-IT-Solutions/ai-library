import { AlertCircle, CheckCircle2 } from "lucide-react";

type Props = {
   hasName: boolean;
   isUsed: boolean;
};

export const StatusBadge = ({ hasName, isUsed }: Props) => {
   if (hasName) {
      if (isUsed) {
         return (
            <span
               className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
               data-testid="status-badge"
            >
               <CheckCircle2 className="h-3 w-3" />
               Im Prompt verwendet
            </span>
         );
      }
      return (
         <span
            className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800"
            data-testid="status-badge"
         >
            <AlertCircle className="h-3 w-3" />
            Nicht verwendet
         </span>
      );
   }
};
