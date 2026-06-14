"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Edit, MoreHorizontal, Play, Trash2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
} from "@/components/shadcn/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DWorkflow } from "@/data/types/domain/workflow";
import { DeleteWorkflowDialog } from "../../dialogs/delete-workflow-dialog";

type Props = {
   workflow: DWorkflow;
   ref?: React.Ref<HTMLDivElement>;
};

export const WorkflowItem = ({ workflow, ref }: Props) => {
   const [deleteOpen, setDeleteOpen] = useState(false);

   return (
      <>
         <Card
            ref={ref}
            className="flex flex-col transition-shadow hover:shadow-md"
            data-testid="workflow-item"
         >
            <CardHeader className="pb-2">
               <div className="flex items-start justify-between gap-2">
                  <h3
                     className="line-clamp-1 font-semibold text-slate-900"
                     title={workflow.title}
                  >
                     {workflow.title}
                  </h3>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="h-7 w-7 shrink-0"
                           data-testid="workflow-card-menu"
                        >
                           <MoreHorizontal className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href={`/workflows/${workflow.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Bearbeiten
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={`/workflows/${workflow.id}/run`}>
                              <Play className="mr-2 h-4 w-4" />
                              Ausführen
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           className="text-destructive focus:text-destructive"
                           onClick={() => setDeleteOpen(true)}
                        >
                           <Trash2 className="mr-2 h-4 w-4" />
                           Löschen
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
               {workflow.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                     {workflow.description}
                  </p>
               )}
            </CardHeader>

            <CardContent className="flex-1 pb-2">
               <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">
                     {workflow.stepCount} Schritte
                  </Badge>
                  <span>
                     Zuletzt bearbeitet{" "}
                     {format(new Date(workflow.updatedAt), "dd. MMM yyyy", {
                        locale: de,
                     })}
                  </span>
               </div>
            </CardContent>

            <CardFooter>
               <Button asChild className="w-full" size="sm">
                  <Link href={`/workflows/${workflow.id}/run`}>
                     <Play className="mr-2 h-4 w-4" />
                     Anwenden
                  </Link>
               </Button>
            </CardFooter>
         </Card>

         <DeleteWorkflowDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            workflowId={workflow.id}
            workflowTitle={workflow.title}
            onDeleted={() => {}}
         />
      </>
   );
};
