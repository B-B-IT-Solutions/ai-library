import { type ClassValue, clsx } from "clsx";
import { trim } from "es-toolkit";
import { replace, toLower } from "es-toolkit/compat";
import { twMerge } from "tailwind-merge";

export const toTestId = (text: string) => {
   const trimmed = trim(text);
   const lowerCase = toLower(trimmed);
   return replace(lowerCase, /[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
};

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}
