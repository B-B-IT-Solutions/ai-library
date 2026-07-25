jest.mock("@/data/actions/prompt");

import { ZodError } from "zod";

import { isConflictingPromptCategoryName } from "@/data/actions/prompt";

import { updateCategorySchemaBackendValidation } from "./update-category.schema";

const isConflictingPromptCategoryNameMock =
   isConflictingPromptCategoryName as jest.MockedFunction<
      typeof isConflictingPromptCategoryName
   >;

describe("updateCategorySchemaBackendValidation - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("isConflict false - test", async () => {
      isConflictingPromptCategoryNameMock.mockResolvedValue(false);
      const schema = updateCategorySchemaBackendValidation(1);

      const result = await schema.parseAsync({ name: "Vertrieb" });

      expect(result.name).toBe("Vertrieb");
      expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledTimes(1);
      expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledWith(
         1,
         "Vertrieb"
      );
   });

   it("isConflict true - test", async () => {
      isConflictingPromptCategoryNameMock.mockResolvedValue(true);
      const schema = updateCategorySchemaBackendValidation(1);

      const fn = () => schema.parseAsync({ name: "Support" });

      await expect(fn).rejects.toThrow(ZodError);
   });

   it("isConflict true - error message on name path - test", async () => {
      isConflictingPromptCategoryNameMock.mockResolvedValue(true);
      const schema = updateCategorySchemaBackendValidation(1);

      const result = await schema.safeParseAsync({ name: "Support" });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toEqual(["name"]);
      expect(result.error?.issues[0].message).toBe(
         "Es existiert bereits eine Kategorie mit diesem Namen"
      );
   });

   it("empty name invalid - test", async () => {
      isConflictingPromptCategoryNameMock.mockResolvedValue(false);
      const schema = updateCategorySchemaBackendValidation(1);

      const fn = () => schema.parseAsync({ name: "" });

      await expect(fn).rejects.toThrow(ZodError);
   });

   it("categoryId omitted - isConflict false - test", async () => {
      isConflictingPromptCategoryNameMock.mockResolvedValue(false);
      const schema = updateCategorySchemaBackendValidation();

      const result = await schema.parseAsync({ name: "Vertrieb" });

      expect(result.name).toBe("Vertrieb");
      expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledTimes(1);
      expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledWith(
         undefined,
         "Vertrieb"
      );
   });

   it("categoryId omitted - isConflict true - test", async () => {
      isConflictingPromptCategoryNameMock.mockResolvedValue(true);
      const schema = updateCategorySchemaBackendValidation();

      const fn = () => schema.parseAsync({ name: "Support" });

      await expect(fn).rejects.toThrow(ZodError);
      expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledWith(
         undefined,
         "Support"
      );
   });
});
