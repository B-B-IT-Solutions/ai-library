import {
   BreadcrumbLinkProps,
   ItemDetailsBreadcrumb,
} from "@/components/shared/breadcrumbs";
import { DWorkflow } from "@/data/types/domain/workflow";
import { breadcrumbRootUrl, viewWorkflowUrl } from "../utils/utils";

type Props =
   | {
        variant: "view";
        label: string;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "edit";
        workflow: DWorkflow;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "new";
        root?: BreadcrumbLinkProps;
     };

export const WorkflowBreadcrumb = (props: Props) => {
   const defaultRoot: BreadcrumbLinkProps = {
      label: "Workflows",
      href: breadcrumbRootUrl(),
   };

   if (props.variant === "new") {
      return (
         <ItemDetailsBreadcrumb
            root={props.root || defaultRoot}
            variant={props.variant}
            page={{
               label: "Neuer Prompt",
            }}
            data-testid="workflow-breadcrumb"
         />
      );
   }

   if (props.variant === "edit") {
      const { workflow: prompt, variant, root } = props;
      return (
         <ItemDetailsBreadcrumb
            root={root || defaultRoot}
            variant={variant}
            link={{
               href: viewWorkflowUrl(prompt),
               label: prompt.title,
               tooltip: prompt.title,
            }}
            data-testid="workflow-breadcrumb"
         />
      );
   }

   return (
      <ItemDetailsBreadcrumb
         root={props.root || defaultRoot}
         variant={props.variant}
         page={{
            label: props.label,
            tooltip: props.label,
         }}
         data-testid="workflow-breadcrumb"
      />
   );
};
