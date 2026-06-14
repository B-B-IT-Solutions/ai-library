"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DeleteButton } from "@/components/shared/buttons";
import { DeleteDropdownMenuItem } from "@/components/shared/dropdowns";
import { deleteWorkflow } from "@/data/actions/workflow";
import { DWorkflow } from "@/data/types/domain/workflow";

type Props = {
   workflow: DWorkflow;
   asMenuItem?: boolean;
};

export const DeleteWorkflowButton = ({ workflow, asMenuItem }: Props) => {
   const router = useRouter();

   const handleDelete = async () => {
      const result = await deleteWorkflow(workflow.id);
      if (result.success) {
         toast.success(result.message);
         router.push("/workflows");
      } else {
         toast.error(result.message);
      }
   };

   if (asMenuItem) {
      return (
         <DeleteDropdownMenuItem
            label="Löschen"
            onDelete={handleDelete}
            dialog={{
               title: "Workflow löschen?",
               description:
                  "Diese Aktion kann nicht rückgängig gemacht werden. Der Workflow wird dauerhaft gelöscht.",
            }}
            data-testid="delete-workflow-menu-item"
         />
      );
   }

   return (
      <DeleteButton
         label="Löschen"
         onDelete={handleDelete}
         dialog={{
            title: "Workflow löschen?",
            description:
               "Diese Aktion kann nicht rückgängig gemacht werden. Der Workflow wird dauerhaft gelöscht.",
         }}
         data-testid="delete-workflow-btn"
      />
   );
};
