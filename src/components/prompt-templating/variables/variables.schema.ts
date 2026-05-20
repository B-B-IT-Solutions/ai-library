import { forEach } from "es-toolkit/compat";
import {
   z,
   ZodBoolean,
   ZodCoercedNumber,
   ZodDefault,
   ZodEmail,
   ZodOptional,
   ZodString,
   ZodType,
} from "zod";

import { DPromptVariable } from "@/data/types/domain/prompt";

const emailValidator = (field: DPromptVariable): ZodEmail => {
   const validator = z.email("Ungültige E-Mail");
   if (field.required) {
      return validator.min(1, `${field.label} ist erforderlich`);
   }
   return validator;
};

const numberValidator = (field: DPromptVariable): ZodCoercedNumber => {
   const validator = z.coerce.number();
   if (field.required) {
      return validator.min(1, `${field.label} ist erforderlich`);
   }
   return validator;
};

const dateValidator = (field: DPromptVariable): ZodString => {
   const validator = z.string();
   if (field.required) {
      return validator.min(1, `${field.label} ist erforderlich`);
   }
   return validator;
};

const booleanValidator = (
   field: DPromptVariable
): ZodDefault<ZodBoolean> | ZodOptional<ZodDefault<ZodBoolean>> => {
   const validator = z.boolean().default(false);
   if (!field.required) {
      return validator.optional();
   }
   return validator;
};

export const buildFieldsSchema = (fields: DPromptVariable[]) => {
   const shape: Record<string, ZodType> = {};
   forEach(fields, (field) => {
      let validator: ZodType;

      switch (field.type) {
         case "EMAIL":
            validator = emailValidator(field);
            break;
         case "NUMBER":
            validator = numberValidator(field);
            break;
         case "DATE":
            validator = dateValidator(field);
            break;
         case "CHECKBOX":
            validator = booleanValidator(field);
            break;
         default:
            validator = field.required
               ? z.string().min(1, `${field.label} ist erforderlich`)
               : z.string();
      }

      shape[field.name] = validator;
   });

   return z.object(shape);
};
