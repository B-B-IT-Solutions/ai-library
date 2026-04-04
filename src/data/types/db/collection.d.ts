import { LibraryCollection } from "@/generated/prisma/client";

export type PLibraryCollection = LibraryCollection & {
   _count: {
      entries: number;
   };
};
