import { join, map } from "es-toolkit/compat";

export const EMPTY_PAGE = {
   content: [],
   pageNumber: 1,
   pageSize: 10,
   numberOfElements: 50,
   totalPages: 0,
   totalElements: 0,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any) => {
   const isZodError = error.name === "ZodError";
   const isPrismaError = error.name === "PrismaClientKnownRequestError";

   if (isZodError) {
      const issues = map(error.issues, (issue) => issue.message);
      return join(issues, "\n");
   } else if (isPrismaError && error.code === "P2002") {
      const field = error.meta?.target ? error.meta.target[0] : "Field";
      return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
   } else {
      const isStringMessage = typeof error.message === "string";
      return isStringMessage ? error.message : JSON.stringify(error.message);
   }
};
