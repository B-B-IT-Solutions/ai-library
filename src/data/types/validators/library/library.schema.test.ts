import { ZodError } from "zod";

import { DCollectionUpdate } from "@/data/types/domain/collection";

import { updateLibraryCollectionSchema } from "./library.schema";

describe("updateLibraryCollectionSchema tests", () => {
   it("updateLibraryCollectionSchema - data valid - all fields - test", () => {
      const formData: DCollectionUpdate = {
         name: "My Collection",
         description: "A description",
         color: "#ff0000",
         order: 1,
      };

      const result = updateLibraryCollectionSchema.parse(formData);
      expect(result).toEqual(formData);
   });

   it("updateLibraryCollectionSchema - data valid - only required fields - test", () => {
      const formData: DCollectionUpdate = {
         name: "My Collection",
      };

      const result = updateLibraryCollectionSchema.parse(formData);
      expect(result).toEqual(formData);
   });

   it("updateLibraryCollectionSchema - data invalid - name empty - test", () => {
      const formData = { name: "" };

      const fn = () => updateLibraryCollectionSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });

   it("updateLibraryCollectionSchema - data invalid - name missing - test", () => {
      const formData = {};

      const fn = () => updateLibraryCollectionSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });

   it("updateLibraryCollectionSchema - data invalid - name exceeds max length - test", () => {
      const formData = { name: "a".repeat(251) };

      const fn = () => updateLibraryCollectionSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });

   it("updateLibraryCollectionSchema - data invalid - description exceeds max length - test", () => {
      const formData = {
         name: "My Collection",
         description: "a".repeat(751),
      };

      const fn = () => updateLibraryCollectionSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });
});
