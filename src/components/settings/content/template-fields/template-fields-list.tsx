import { map } from "es-toolkit/compat";

import { DGlobalTemplateField } from "@/data/types/domain/settings";

import { AddTemplateFieldButton } from "./buttons";
import { GlobalTemplateFieldItem } from "./template-field-item";

type Props = {
   fields: DGlobalTemplateField[];
};

export const GlobalTemplateFieldsList = ({ fields }: Props) => {
   const renderField = (field: DGlobalTemplateField) => {
      return <GlobalTemplateFieldItem field={field} key={field.id} />;
   };

   return (
      <div className="space-y-4" data-testid="template-fields-list">
         <div className="flex justify-end">
            <AddTemplateFieldButton />
         </div>

         <div className="space-y-2">{map(fields, renderField)}</div>
      </div>
   );
};
