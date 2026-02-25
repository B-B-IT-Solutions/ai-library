"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useSetUrlSearchParams = () => {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();

   const setUrlSearchParams = (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      replace(`${pathname}?${params.toString()}`);
   };

   return {
      setUrlSearchParams: setUrlSearchParams,
   };
};
