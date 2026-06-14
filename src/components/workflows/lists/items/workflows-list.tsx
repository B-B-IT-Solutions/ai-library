import { map } from "es-toolkit/compat";

import { DWorkflow } from "@/data/types/domain/workflow";
import { WorkflowItem } from "../item";

type Props = {
   workflows: DWorkflow[];
   ref?: React.Ref<HTMLDivElement>;
};

export const WorfklowsList = ({ workflows, ref }: Props) => {
   const item = (workflow: DWorkflow, index: number) => {
      const isLast = index === workflows.length - 1;
      return (
         <WorkflowItem
            key={workflow.id}
            workflow={workflow}
            ref={isLast ? ref : undefined}
         />
      );
   };

   return (
      <div className="space-y-4" data-testid="workflows-list">
         {map(workflows, (d, i) => item(d, i))}
      </div>
   );
};
