import { ZodError } from "zod";

import { DCollectionUpdate } from "@/data/types/domain/collection";

import { updateCollectionSchema } from "./library.schema";

describe("updateCollectionSchema tests", () => {
   it("data valid - all fields - test", () => {
      const formData: DCollectionUpdate = {
         name: "My Collection",
         description: "A description",
         color: "#ff0000",
         order: 1,
      };

      const result = updateCollectionSchema.parse(formData);
      expect(result).toEqual(formData);
   });

   it("data valid - only required fields - test", () => {
      const formData: DCollectionUpdate = {
         name: "My Collection",
      };

      const result = updateCollectionSchema.parse(formData);
      expect(result).toEqual(formData);
   });

   it("data invalid - name empty - test", () => {
      const formData = { name: "" };

      const fn = () => updateCollectionSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - name missing - test", () => {
      const formData = {};

      const fn = () => updateCollectionSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - name exceeds max length - test", () => {
      const formData = { name: "a".repeat(251) };

      const fn = () => updateCollectionSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - description exceeds max length - test", () => {
      const formData = {
         name: "My Collection",
         description: "a".repeat(751),
      };

      const fn = () => updateCollectionSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });
});
