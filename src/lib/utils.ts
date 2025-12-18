import { type ClassValue, clsx } from "clsx";
import { trim } from "es-toolkit";
import { replace, toLower } from "es-toolkit/compat";
import { twMerge } from "tailwind-merge";

export const navigateToExternalUrl = (url: string) => {
   window.location.href = url;
};

export const toTestId = (text: string) => {
   const trimmed = trim(text);
   const lowerCase = toLower(trimmed);
   return replace(lowerCase, /[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
};

export const cn = (...inputs: ClassValue[]) => {
   return twMerge(clsx(inputs));
};

export const formatDateTime = (dateString: string) => {
   const dateTimeOptions: Intl.DateTimeFormatOptions = {
      month: "short", // abbreviated month name (e.g., 'Oct')
      year: "numeric", // abbreviated month name (e.g., 'Oct')
      day: "numeric", // numeric day of the month (e.g., '25')
      hour: "2-digit", // numeric hour (e.g., '8')
      minute: "2-digit", // numeric minute (e.g., '30')
      hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
   };
   const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "short", // abbreviated weekday name (e.g., 'Mon')
      month: "short", // abbreviated month name (e.g., 'Oct')
      year: "numeric", // numeric year (e.g., '2023')
      day: "numeric", // numeric day of the month (e.g., '25')
   };
   const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit", // numeric hour (e.g., '8')
      minute: "2-digit", // numeric minute (e.g., '30')
      hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
   };
   const formattedDateTime: string = new Date(dateString).toLocaleString(
      "de-DE",
      dateTimeOptions
   );
   const formattedDate: string = new Date(dateString).toLocaleString(
      "de-DE",
      dateOptions
   );
   const formattedTime: string = new Date(dateString).toLocaleString(
      "de-DE",
      timeOptions
   );
   return {
      dateTime: formattedDateTime,
      dateOnly: formattedDate,
      timeOnly: formattedTime,
   };
};
