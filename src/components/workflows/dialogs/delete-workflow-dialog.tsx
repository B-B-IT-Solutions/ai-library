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
import { deleteWorkflow } from "@/data/actions/workflow";

type Props = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   workflowId: string;
   workflowTitle: string;
   onDeleted: () => void;
};

export const DeleteWorkflowDialog = ({
   open,
   onOpenChange,
   workflowId,
   workflowTitle,
   onDeleted,
}: Props) => {
   const [loading, setLoading] = useState(false);

   const handleDelete = async () => {
      setLoading(true);
      const result = await deleteWorkflow(workflowId);
      setLoading(false);
      if (result.success) {
         toast.success(result.message);
         onOpenChange(false);
         onDeleted();
      } else {
         toast.error(result.message);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Workflow löschen</DialogTitle>
               <DialogDescription>
                  Möchtest du den Workflow{" "}
                  <strong>&quot;{workflowTitle}&quot;</strong> wirklich löschen?
                  Alle Schritte und Verbindungen werden ebenfalls gelöscht. Diese
                  Aktion kann nicht rückgängig gemacht werden.
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
                  data-testid="confirm-delete-btn"
               >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Löschen
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
