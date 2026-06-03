import { type ClassValue, clsx } from "clsx";
import { trim } from "es-toolkit";
import { replace, toLower } from "es-toolkit/compat";
import ipaddr from "ipaddr.js";
import { twMerge } from "tailwind-merge";

export const toTestId = (text: string) => {
   const trimmed = trim(text);
   const lowerCase = toLower(trimmed);
   return replace(lowerCase, /[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
};

export const cn = (...inputs: ClassValue[]) => {
   return twMerge(clsx(inputs));
};

export const stringify = <T>(value: T) => {
   return value ? JSON.stringify(value) : undefined;
};

export const navigateToExternalUrl = (url: string) => {
   window.location.href = url;
};

export const openExternalUrlInNewTab = (url: string) => {
   window.open(url, "_blank", "noopener,noreferrer");
};

export const removePort = (ip: string): string => {
   // IPv6 with port: [::1]:5678
   if (ip.startsWith("[")) {
      return ip.slice(1, ip.indexOf("]"));
   }
   // IPv4 with port: 1.2.3.4:5678 (plain IPv6 has multiple colons before the last one)
   const lastColon = ip.lastIndexOf(":");
   if (lastColon !== -1 && !ip.slice(0, lastColon).includes(":")) {
      return ip.slice(0, lastColon);
   }
   return ip;
};

export const resolveIpAddresse = (headers: Headers): string | undefined => {
   const raw =
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headers.get("x-real-ip") ??
      undefined;

   if (raw) {
      try {
         const addr = ipaddr.parse(removePort(raw));
         if (addr.range() !== "loopback") {
            return addr.toString();
         }
      } catch {
         return undefined;
      }
   }
   return undefined;
};

export const formatDateTime = (dateString: string) => {
   const dateOptions: Intl.DateTimeFormatOptions = {
      month: "2-digit", // abbreviated month name (e.g., '05')
      year: "numeric", // numeric year (e.g., '2023')
      day: "2-digit", // numeric day of the month (e.g., '25')
   };
   const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit", // numeric hour (e.g., '8')
      minute: "2-digit", // numeric minute (e.g., '30')
      hour12: false, // use 12-hour clock (true) or 24-hour clock (false)
   };
   const dateTimeOptions: Intl.DateTimeFormatOptions = {
      ...dateOptions,
      ...timeOptions,
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
