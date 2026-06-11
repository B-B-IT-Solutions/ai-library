"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { deleteWorkflowStep } from "@/data/actions/workflow";
import { DWorkflowDetail } from "@/data/types/domain/workflow";

type Props = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   stepId: string;
   stepTitle: string;
   workflowId: string;
   onDeleted: (workflow: DWorkflowDetail) => void;
};

export const DeleteStepDialog = ({
   open,
   onOpenChange,
   stepId,
   stepTitle,
   workflowId,
   onDeleted,
}: Props) => {
   const [loading, setLoading] = useState(false);

   const handleDelete = async () => {
      setLoading(true);
      const result = await deleteWorkflowStep(stepId, workflowId);
      setLoading(false);
      if (result.success && result.data) {
         toast.success(result.message);
         onOpenChange(false);
         onDeleted(result.data);
      } else {
         toast.error(result.message);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Schritt löschen</DialogTitle>
               <DialogDescription>
                  Möchtest du den Schritt <strong>&quot;{stepTitle}&quot;</strong>{" "}
                  wirklich löschen? Alle ein- und ausgehenden Verbindungen werden
                  ebenfalls gelöscht.
               </DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
               >
                  Abbrechen
               </Button>
               <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
               >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Löschen
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
