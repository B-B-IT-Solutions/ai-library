jest.mock("@/data/actions/prompt");

import { ZodError } from "zod";

import { isConflictingPromptModelName } from "@/data/actions/prompt";

import { updateModelSchemaBackendValidation } from "./update-model.schema";

const isConflictingPromptModelNameMock =
   isConflictingPromptModelName as jest.MockedFunction<
      typeof isConflictingPromptModelName
   >;

describe("updateModelSchemaBackendValidation - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("isConflict false - test", async () => {
      isConflictingPromptModelNameMock.mockResolvedValue(false);
      const schema = updateModelSchemaBackendValidation(1);

      const result = await schema.parseAsync({ name: "Claude" });

      expect(result.name).toBe("Claude");
      expect(isConflictingPromptModelNameMock).toHaveBeenCalledTimes(1);
      expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
         1,
         "Claude"
      );
   });

   it("isConflict true - test", async () => {
      isConflictingPromptModelNameMock.mockResolvedValue(true);
      const schema = updateModelSchemaBackendValidation(1);

      const fn = () => schema.parseAsync({ name: "ChatGPT" });

      await expect(fn).rejects.toThrow(ZodError);
   });

   it("isConflict true - error message on name path - test", async () => {
      isConflictingPromptModelNameMock.mockResolvedValue(true);
      const schema = updateModelSchemaBackendValidation(1);

      const result = await schema.safeParseAsync({ name: "ChatGPT" });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toEqual(["name"]);
      expect(result.error?.issues[0].message).toBe(
         "Es existiert bereits ein Modell mit diesem Namen"
      );
   });

   it("empty name invalid - test", async () => {
      isConflictingPromptModelNameMock.mockResolvedValue(false);
      const schema = updateModelSchemaBackendValidation(1);

      const fn = () => schema.parseAsync({ name: "" });

      await expect(fn).rejects.toThrow(ZodError);
   });

   it("modelId omitted - isConflict false - test", async () => {
      isConflictingPromptModelNameMock.mockResolvedValue(false);
      const schema = updateModelSchemaBackendValidation();

      const result = await schema.parseAsync({ name: "Claude" });

      expect(result.name).toBe("Claude");
      expect(isConflictingPromptModelNameMock).toHaveBeenCalledTimes(1);
      expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
         undefined,
         "Claude"
      );
   });

   it("modelId omitted - isConflict true - test", async () => {
      isConflictingPromptModelNameMock.mockResolvedValue(true);
      const schema = updateModelSchemaBackendValidation();

      const fn = () => schema.parseAsync({ name: "ChatGPT" });

      await expect(fn).rejects.toThrow(ZodError);
      expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
         undefined,
         "ChatGPT"
      );
   });
});
