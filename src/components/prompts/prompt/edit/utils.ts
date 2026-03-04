import { filter } from "es-toolkit/compat";

export const removeEmpty = (values: string[]) => {
   return filter(values, (v) => v.trim() !== "");
};
