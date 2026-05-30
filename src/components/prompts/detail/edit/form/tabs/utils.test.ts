import { dtestData } from "@tests";

import { DPromptVariableUpdate } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { VariableStatus } from "../utils/variables";

import { resolveVariableStatus } from "./utils";

const makePromptVariable = (
   name: string,
   order = 0
): DPromptVariableUpdate => ({
   name,
   label: name,
   type: "TEXT",
   required: false,
   order,
});

const makeGlobalField = (
   id: string,
   name: string,
   order = 0
): DGlobalPromptField => ({
   id,
   userId: "user-1",
   name,
   label: name,
   description: null,
   type: "TEXT",
   required: false,
   defaultValue: null,
   order,
   createdAt: "2024-01-01T00:00:00.000Z",
   updatedAt: "2024-01-01T00:00:00.000Z",
});

describe("resolveVariableStatus tests", () => {
   describe("no prompt or global variables defined", () => {
      it("detectedVariables empty - variables empty - test", () => {
         const result = resolveVariableStatus([], [], [], []);

         const expectResult: VariableStatus = {
            undefined: [],
            used: [],
            unused: [],
         };
         expect(result).toEqual(expectResult);
      });

      it("detectedVariables empty - variables - test", () => {
         const variable = dtestData.dPromptVariableUpdate();
         const promptVars = [variable];

         const result = resolveVariableStatus([], promptVars, [], []);

         const expectResult: VariableStatus = {
            undefined: [],
            used: [],
            unused: [variable.name],
         };
         expect(result).toEqual(expectResult);
      });

      it("detectedVariables - variables empty - test", () => {
         const detectedVariables = ["name", "email"];
         const result = resolveVariableStatus(detectedVariables, [], [], []);

         const expectResult: VariableStatus = {
            undefined: detectedVariables,
            used: [],
            unused: [],
         };
         expect(result).toEqual(expectResult);
      });
   });

   describe("prompt variables", () => {
      it("detectedVariables - variables - test", () => {
         const variable1 = dtestData.dPromptVariableUpdate(1);
         const variable2 = dtestData.dPromptVariableUpdate(2);
         const promptVars = [variable1, variable2];
         const detectedVariables = [variable1.name, variable2.name];

         const result = resolveVariableStatus(
            detectedVariables,
            promptVars,
            [],
            []
         );

         const expectResult: VariableStatus = {
            undefined: [],
            used: [variable1.name, variable2.name],
            unused: [],
         };
         expect(result).toEqual(expectResult);
      });

      it("detectedVariables empty - variables - test", () => {
         const variable1 = dtestData.dPromptVariableUpdate(1);
         const variable2 = dtestData.dPromptVariableUpdate(2);
         const variable3 = dtestData.dPromptVariableUpdate(3);
         const promptVars = [variable1, variable2];
         const detectedVariables = [variable1.name, variable3.name];

         const result = resolveVariableStatus(
            detectedVariables,
            promptVars,
            [],
            []
         );

         const expectResult: VariableStatus = {
            undefined: [variable3.name],
            used: [variable1.name],
            unused: [variable2.name],
         };
         expect(result).toEqual(expectResult);
      });
   });

   describe("global variables", () => {
      it("includes global variable names when their IDs are in globalVariableIds", () => {
         const globalFields = [
            makeGlobalField("gf-1", "company"),
            makeGlobalField("gf-2", "department"),
         ];

         const result = resolveVariableStatus(
            ["company", "department"],
            [],
            globalFields,
            ["gf-1", "gf-2"]
         );

         expect(result.undefined).toEqual([]);
         expect(result.used).toEqual(["company", "department"]);
         expect(result.unused).toEqual([]);
      });

      it("excludes global variables whose IDs are not in globalVariableIds", () => {
         const globalFields = [
            makeGlobalField("gf-1", "company"),
            makeGlobalField("gf-2", "department"),
         ];

         const result = resolveVariableStatus(
            ["company", "department"],
            [],
            globalFields,
            ["gf-1"] // only gf-1 selected
         );

         expect(result.undefined).toEqual(["department"]);
         expect(result.used).toEqual(["company"]);
         expect(result.unused).toEqual([]);
      });

      it("returns all detected variables as undefined when globalVariableIds is empty", () => {
         const globalFields = [
            makeGlobalField("gf-1", "company"),
            makeGlobalField("gf-2", "department"),
         ];

         const result = resolveVariableStatus(
            ["company"],
            [],
            globalFields,
            []
         );

         expect(result.undefined).toEqual(["company"]);
         expect(result.used).toEqual([]);
         expect(result.unused).toEqual([]);
      });

      it("uses the name field of global fields, not the label", () => {
         const globalField: DGlobalPromptField = {
            ...makeGlobalField("gf-1", "internalName"),
            label: "Display Label",
         };

         const result = resolveVariableStatus(
            ["internalName"],
            [],
            [globalField],
            ["gf-1"]
         );

         expect(result.undefined).toEqual([]);
         expect(result.used).toEqual(["internalName"]);
      });
   });

   describe("combined prompt and global variables", () => {
      it("combines prompt and global variable names for status resolution", () => {
         const promptVars = [makePromptVariable("name")];
         const globalFields = [makeGlobalField("gf-1", "company")];

         const result = resolveVariableStatus(
            ["name", "company", "email"],
            promptVars,
            globalFields,
            ["gf-1"]
         );

         expect(result.undefined).toEqual(["email"]);
         expect(result.used).toEqual(["name", "company"]);
         expect(result.unused).toEqual([]);
      });

      it("prompt and global variables can both appear as unused", () => {
         const promptVars = [makePromptVariable("phone")];
         const globalFields = [makeGlobalField("gf-1", "department")];

         const result = resolveVariableStatus([], promptVars, globalFields, [
            "gf-1",
         ]);

         expect(result.undefined).toEqual([]);
         expect(result.used).toEqual([]);
         expect(result.unused).toEqual(["phone", "department"]);
      });

      it("handles complex real-world scenario with mixed variable sources", () => {
         const promptVars = [
            makePromptVariable("firstName", 0),
            makePromptVariable("lastName", 1),
            makePromptVariable("extraPromptVar", 2),
         ];
         const globalFields = [
            makeGlobalField("gf-1", "company"),
            makeGlobalField("gf-2", "department"),
            makeGlobalField("gf-3", "notSelected"),
         ];

         const result = resolveVariableStatus(
            ["firstName", "lastName", "company", "newVar"],
            promptVars,
            globalFields,
            ["gf-1", "gf-2"] // gf-3 not selected
         );

         expect(result.undefined).toEqual(["newVar"]);
         expect(result.used).toContain("firstName");
         expect(result.used).toContain("lastName");
         expect(result.used).toContain("company");
         expect(result.unused).toContain("extraPromptVar");
         expect(result.unused).toContain("department");
         expect(result.unused).not.toContain("notSelected");
      });
   });
});
