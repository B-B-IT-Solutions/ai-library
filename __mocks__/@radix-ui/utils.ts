import { get, has, set, unset } from "es-toolkit/compat";

export const clearProps = (props: object) => {
   if (has(props, "asChild")) {
      unset(props, "asChild");
   }
   if (has(props, "sideOffset")) {
      const value = get(props, "sideOffset");
      set(props, "sideoffset", value);
      unset(props, "sideOffset");
   }
   if (has(props, "forceMount")) {
      unset(props, "forceMount");
   }
   if (has(props, "present")) {
      unset(props, "present");
   }
};
