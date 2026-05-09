"use client";

import { useTransition } from "react";
import { Loader2, Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { copyCatalogEntryToUserTemplates } from "@/data/actions/catalog";
import { DCatalogEntry } from "@/data/types/domain/catalog";

type Props = {
   entry: DCatalogEntry;
   isAuthenticated: boolean;
};

export const CopyCatalogEntryButton = ({ entry, isAuthenticated }: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   if (!isAuthenticated) {
      return (
         <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            data-testid="catalog-entry-register-btn"
         >
            <Link
               href={`/auth/sign-up?redirect=/explore/${entry.slug}`}
               className="flex items-center gap-2"
            >
               <UserPlus className="h-4 w-4" />
               Registrieren um zu übernehmen
            </Link>
         </Button>
      );
   }

   const handleCopy = () => {
      startTransition(async () => {
         const result = await copyCatalogEntryToUserTemplates(entry.id);

         if (result.success) {
            toast.success("Vorlage wurde in deine Library übernommen", {
               action: {
                  label: "Jetzt anzeigen",
                  onClick: () => {
                     router.push(`/templates/${result.data!.templateId}`);
                  },
               },
               duration: 5000,
            });
         } else {
            toast.error("Vorlage konnte nicht übernommen werden");
         }
      });
   };

   return (
      <Button
         onClick={handleCopy}
         disabled={isPending}
         size="lg"
         className="w-full sm:w-auto"
         data-testid="catalog-entry-copy-btn"
      >
         {isPending ? (
            <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Wird übernommen…
            </>
         ) : (
            <>
               <Plus className="mr-2 h-4 w-4" />
               In Bibliothek übernehmen
            </>
         )}
      </Button>
   );
};
