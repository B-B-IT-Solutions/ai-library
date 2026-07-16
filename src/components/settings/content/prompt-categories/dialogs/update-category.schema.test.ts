jest.mock("@/data/actions/prompt");

import { ZodError } from "zod";

import { isConflictingPromptCategoryName } from "@/data/actions/prompt";

import { updateCategorySchemaBackendValidation } from "./update-category.schema";

const checkCategoryNameAvailableMock =
   isConflictingPromptCategoryName as jest.MockedFunction<
      typeof isConflictingPromptCategoryName
   >;

describe("updateCategorySchemaBackendValidation - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("name available - valid - test", async () => {
      checkCategoryNameAvailableMock.mockResolvedValue(true);
      const schema = updateCategorySchemaBackendValidation(1);

      const result = await schema.parseAsync({ name: "Vertrieb" });

      expect(result.name).toBe("Vertrieb");
      expect(checkCategoryNameAvailableMock).toHaveBeenCalledTimes(1);
      expect(checkCategoryNameAvailableMock).toHaveBeenCalledWith(
         1,
         "Vertrieb"
      );
   });

   it("name already taken - invalid - test", async () => {
      checkCategoryNameAvailableMock.mockResolvedValue(false);
      const schema = updateCategorySchemaBackendValidation(1);

      const fn = () => schema.parseAsync({ name: "Support" });

      await expect(fn).rejects.toThrow(ZodError);
   });

   it("name already taken - error message on name path - test", async () => {
      checkCategoryNameAvailableMock.mockResolvedValue(false);
      const schema = updateCategorySchemaBackendValidation(1);

      const result = await schema.safeParseAsync({ name: "Support" });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toEqual(["name"]);
      expect(result.error?.issues[0].message).toBe(
         "Es existiert bereits eine Kategorie mit diesem Namen"
      );
   });

   it("empty name invalid - test", async () => {
      checkCategoryNameAvailableMock.mockResolvedValue(true);
      const schema = updateCategorySchemaBackendValidation(1);

      const fn = () => schema.parseAsync({ name: "" });

      await expect(fn).rejects.toThrow(ZodError);
   });
});
