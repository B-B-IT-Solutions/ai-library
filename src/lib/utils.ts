import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const toTestId = (text: string) => {
   const trimmed = trim(text);
   const lowerCase = toLower(trimmed);
   return replace(lowerCase, /[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
};

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}
