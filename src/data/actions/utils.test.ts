import { EMPTY_PAGE, formatError } from "./utils";

const expectedEmptyPage = {
   content: [],
   pageNumber: 1,
   pageSize: 10,
   numberOfElements: 50,
   totalPages: 0,
   totalElements: 0,
};

describe("formatError tests", () => {
   it("formatError - zod error -  test", async () => {
      const error = {
         name: "ZodError",
         issues: [
            { message: "error 1" },
            { message: "error 2" },
            { message: "error 3" },
         ],
      };

      const result = formatError(error);
      const expectedResult = "error 1\nerror 2\nerror 3";
      expect(result).toEqual(expectedResult);
   });

   it("formatError - prisma error - email already exists - meta defined -  test", async () => {
      const error = {
         name: "PrismaClientKnownRequestError",
         code: "P2002",
         meta: {
            target: ["field 1"],
         },
      };

      const result = formatError(error);
      const expectedResult = "Field 1 already exists";
      expect(result).toEqual(expectedResult);
   });

   it("formatError - prisma error - email already exists - meta undefined -  test", async () => {
      const error = {
         name: "PrismaClientKnownRequestError",
         code: "P2002",
      };

      const result = formatError(error);
      const expectedResult = "Field already exists";
      expect(result).toEqual(expectedResult);
   });

   it("formatError - other error - typeOf string -  test", async () => {
      const error = {
         name: "Other",
         message: "error 1",
      };

      const result = formatError(error);
      const expectedResult = "error 1";
      expect(result).toEqual(expectedResult);
   });

   it("formatError - other error - typeOf object -  test", async () => {
      const error = {
         name: "Other",
         message: { value: "error 1" },
      };

      const result = formatError(error);
      const expectedResult = JSON.stringify(error.message);
      expect(result).toEqual(expectedResult);
   });
});

describe("empty page tests", () => {
   it("empty page test", async () => {
      expect(EMPTY_PAGE).toEqual(expectedEmptyPage);
   });
});
