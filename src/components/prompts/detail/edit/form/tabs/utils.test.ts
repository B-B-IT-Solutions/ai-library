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
      it("detectedVariables - globalvariables - test", () => {
         const gVariable1 = dtestData.dGlobalPromptField(1);
         const gVariable2 = dtestData.dGlobalPromptField(2);
         const globalVariables = [gVariable1, gVariable2];
         const globalVariableIds = [gVariable1.id, gVariable2.id];

         const detectedVariables = [gVariable1.name, gVariable2.name];

         const result = resolveVariableStatus(
            detectedVariables,
            [],
            globalVariables,
            globalVariableIds
         );

         const expectResult: VariableStatus = {
            undefined: [],
            used: [gVariable1.name, gVariable2.name],
            unused: [],
         };
         expect(result).toEqual(expectResult);
      });

      it("detectedVariables - globalvariables - excludes is not in globalVariableIds - test", () => {
         const gVariable1 = dtestData.dGlobalPromptField(1);
         const gVariable2 = dtestData.dGlobalPromptField(2);
         const globalVariables = [gVariable1, gVariable2];
         const globalVariableIds = [gVariable1.id]; // only gv-1 selected

         const detectedVariables = [gVariable1.name, gVariable2.name];

         const result = resolveVariableStatus(
            detectedVariables,
            [],
            globalVariables,
            globalVariableIds
         );

         const expectResult: VariableStatus = {
            undefined: [gVariable2.name],
            used: [gVariable1.name],
            unused: [],
         };
         expect(result).toEqual(expectResult);
      });

      it("detectedVariables - globalvariables - globalVariableIds empty - test", () => {
         const gVariable1 = dtestData.dGlobalPromptField(1);
         const gVariable2 = dtestData.dGlobalPromptField(2);
         const globalVariables = [gVariable1, gVariable2];
         const detectedVariables = [gVariable1.name];

         const result = resolveVariableStatus(
            detectedVariables,
            [],
            globalVariables,
            []
         );

         const expectResult: VariableStatus = {
            undefined: [gVariable1.name],
            used: [],
            unused: [],
         };
         expect(result).toEqual(expectResult);
      });
   });

   describe("combined prompt and global variables", () => {
      it("combines prompt and global variable names for status resolution", () => {
         const variable1 = dtestData.dPromptVariableUpdate(1);
         const variable2 = dtestData.dPromptVariableUpdate(2);
         const gVariable = dtestData.dGlobalPromptField(1);
         const globalVariableIds = [gVariable.id]; // only gv-1 selected

         const promptVars = [variable1];
         const globalVariables = [gVariable];
         const detectedVariables = [
            variable1.name,
            gVariable.name,
            variable2.name,
         ];

         const result = resolveVariableStatus(
            detectedVariables,
            promptVars,
            globalVariables,
            globalVariableIds
         );

         const expectResult: VariableStatus = {
            undefined: [variable2.name],
            used: [variable1.name, gVariable.name],
            unused: [],
         };
         expect(result).toEqual(expectResult);
      });

      it("prompt and global variables can both appear as unused", () => {
         const variable = dtestData.dPromptVariableUpdate(1);
         const gVariable = dtestData.dGlobalPromptField(1);
         const globalVariableIds = [gVariable.id]; // only gv-1 selected

         const promptVars = [variable];
         const globalVariables = [gVariable];

         const result = resolveVariableStatus(
            [],
            promptVars,
            globalVariables,
            globalVariableIds
         );

         const expectResult: VariableStatus = {
            undefined: [],
            used: [],
            unused: [variable.name, gVariable.name],
         };
         expect(result).toEqual(expectResult);
      });

      it("complex - real word scenario - test", () => {
         const variable1 = dtestData.dPromptVariableUpdate(1);
         const variable2 = dtestData.dPromptVariableUpdate(2);
         const variable3 = dtestData.dPromptVariableUpdate(3);
         const variable4 = dtestData.dPromptVariableUpdate(4);
         const gVariable1 = dtestData.dGlobalPromptField(1);
         const gVariable2 = dtestData.dGlobalPromptField(2);
         const gVariable3 = dtestData.dGlobalPromptField(3);
         const globalVariableIds = [gVariable1.id, gVariable2.id];

         const promptVars = [variable1, variable2, variable3];
         const globalVariables = [gVariable1, gVariable2, gVariable3];
         const detectedVariables = [
            variable1.name,
            variable2.name,
            gVariable1.name,
            variable4.name,
         ];

         const result = resolveVariableStatus(
            detectedVariables,
            promptVars,
            globalVariables,
            globalVariableIds
         );

         const expectResult: VariableStatus = {
            undefined: [variable4.name],
            used: [variable1.name, variable2.name, gVariable1.name],
            unused: [variable3.name, gVariable2.name],
         };
         expect(result).toEqual(expectResult);
      });
   });
});
