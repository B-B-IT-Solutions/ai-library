jest.mock("@/data/repositories/prompt-template");
jest.mock("@/data/services/settings");
jest.mock("@/lib/template");

import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptTemplateRepository } from "@/data/repositories/prompt-template";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateField,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { FieldsValidationResult, TemplateEngine } from "@/lib/template";
import { ServiceFactory } from "../service.factory";
import { SettingsService } from "../settings";

import { PromptTemplateService } from "./prompt.template.service";

const serviceFactory = new ServiceFactory(prisma);
const settingsService = serviceFactory.getSettingsService();

const settingsServiceMock = settingsService as DeepMockProxy<SettingsService>;

const promptTemplateRepo = new PromptTemplateRepository(prisma);
const promptTemplateRepoMock =
   promptTemplateRepo as DeepMockProxy<PromptTemplateRepository>;

const promptTemplateService = new PromptTemplateService(
   promptTemplateRepoMock,
   settingsServiceMock
);

const sValidate = TemplateEngine.validate;
const sReplace = TemplateEngine.replace;
const sExtractVariables = TemplateEngine.extractVariables;

const sValidateMock = sValidate as jest.MockedFunction<typeof sValidate>;
const sReplaceMock = sReplace as jest.MockedFunction<typeof sReplace>;
const sExtractVariablesMock = sExtractVariables as jest.MockedFunction<
   typeof sExtractVariables
>;

describe("getTemplateDataForPromptGeneration tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getTemplateDataForPromptGeneration - template null - test", async () => {
      const userId = "user-id-1";
      promptTemplateRepoMock.pGetPromptTemplate.mockResolvedValue(null);

      const templateId = "template-id-1";
      const result =
         await promptTemplateService.getTemplateDataForPromptGeneration(
            userId,
            templateId
         );

      expect(result).toBeNull();
      expect(promptTemplateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(
         1
      );
      expect(promptTemplateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         templateId
      );
      expect(
         settingsServiceMock.getGlobalTemplateFieldsByIds
      ).not.toHaveBeenCalled();
   });

   it("getTemplateDataForPromptGeneration - data retrieved - test", async () => {
      const userId = "user-id-1";
      const template = dtestData.dPromptTemplate();
      promptTemplateRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const globalFields = dtestData.dGlobalTemplateFields();
      settingsServiceMock.getGlobalTemplateFieldsByIds.mockResolvedValue(
         globalFields
      );

      const { id, globalFieldIds } = template;
      const result =
         await promptTemplateService.getTemplateDataForPromptGeneration(
            userId,
            id
         );

      const allFields = promptTemplateService.resolveAllTemplateFields(
         template,
         globalFields
      );

      const expectedResult: DPromptTemplateDataPromptGeneration = {
         template,
         allFields,
      };

      expect(result).toEqual(expectedResult);
      expect(promptTemplateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(
         1
      );
      expect(promptTemplateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(
         settingsServiceMock.getGlobalTemplateFieldsByIds
      ).toHaveBeenCalledTimes(1);
      expect(
         settingsServiceMock.getGlobalTemplateFieldsByIds
      ).toHaveBeenCalledWith(userId, globalFieldIds);
   });
});

describe("getPromptTemplateDescriptors tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplateDescriptors - params undefined - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      promptTemplateRepoMock.pGetPromptTemplateDescriptors.mockResolvedValue(
         templates
      );

      const result = await promptTemplateService.getPromptTemplateDescriptors();

      expect(result).toEqual(templates);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledWith(undefined);
   });

   it("getPromptTemplateDescriptors - params empty - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      promptTemplateRepoMock.pGetPromptTemplateDescriptors.mockResolvedValue(
         templates
      );

      const result = await promptTemplateService.getPromptTemplateDescriptors(
         {}
      );

      expect(result).toEqual(templates);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledWith({});
   });

   it("getPromptTemplateDescriptors - params defined - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      promptTemplateRepoMock.pGetPromptTemplateDescriptors.mockResolvedValue(
         templates
      );

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const params = { search, categories };

      const result =
         await promptTemplateService.getPromptTemplateDescriptors(params);

      expect(result).toEqual(templates);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledWith(params);
   });
});

describe("getPromptTemplateDescriptorWithTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplateDescriptorWithTemplate - descriptor retrieved - test", async () => {
      const userId = "user-id-1";
      const template = dtestData.dPromptTemplateDescriptorWithTemplate();
      promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         template
      );

      const { id } = template;
      const result =
         await promptTemplateService.getPromptTemplateDescriptorWithTemplate(
            userId,
            id
         );

      expect(result).toEqual(template);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, id);
   });
});

describe("getPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplate - template retrieved - test", async () => {
      const userId = "user-id-1";
      const template = dtestData.dPromptTemplate();
      promptTemplateRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const { id } = template;
      const result = await promptTemplateService.getPromptTemplate(userId, id);

      expect(result).toEqual(template);
      expect(promptTemplateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(
         1
      );
      expect(promptTemplateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
   });
});

describe("getPromptTemplateCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplateCategories test", async () => {
      const userId = "user-id-1";
      const categories = ptestData.pPromptTemplateCategories();
      promptTemplateRepoMock.pGetPromptTemplateCategories.mockResolvedValue(
         categories
      );

      const result =
         await promptTemplateService.getPromptTemplateCategories(userId);

      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateCategories
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateCategories
      ).toHaveBeenCalledWith(userId);
   });
});

describe("createPromptTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createPromptTemplateDescriptor - descriptor created - test", async () => {
      const userId = "user-id-1";
      const newData = dtestData.dPromptTemplateUpdate();
      const newDescriptor = dtestData.dPromptTemplateDescriptor();
      promptTemplateRepoMock.pCreatePromptTemplateDescriptor.mockResolvedValue(
         newDescriptor
      );

      const result = await promptTemplateService.createPromptTemplateDescriptor(
         userId,
         newData
      );

      expect(result).toEqual(newDescriptor);
      expect(
         promptTemplateRepoMock.pCreatePromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pCreatePromptTemplateDescriptor
      ).toHaveBeenCalledWith(userId, newData);
   });
});

describe("updatePromptTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updatePromptTemplateDescriptor - descriptor updated - test", async () => {
      const userId = "user-id-1";
      const update = dtestData.dPromptTemplateUpdate();
      const descriptor = dtestData.dPromptTemplateDescriptor();

      await promptTemplateService.updatePromptTemplateDescriptor(
         userId,
         descriptor.id,
         update
      );

      expect(
         promptTemplateRepoMock.pUpdatePromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pUpdatePromptTemplateDescriptor
      ).toHaveBeenCalledWith(userId, descriptor.id, update);
   });
});

describe("deletePromptTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deletePromptTemplateDescriptor - descriptor deleted - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPromptTemplateDescriptor();

      await promptTemplateService.deletePromptTemplateDescriptor(
         userId,
         descriptor.id
      );

      expect(
         promptTemplateRepoMock.pDeletePromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pDeletePromptTemplateDescriptor
      ).toHaveBeenCalledWith(userId, descriptor.id);
   });
});

describe("composePromptFromTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("composePromptFromTemplate - descriptor not found - test", async () => {
      promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         null
      );

      const userId = "user-id-1";
      const id = "non-existent-id";
      const fieldValues: DPromptTemplateFieldValues = {};

      const fn = () =>
         promptTemplateService.composePromptFromTemplate(
            userId,
            id,
            fieldValues
         );

      await expect(fn).rejects.toThrow(
         `PromptTemplateDescriptor with id ${id}not found `
      );

      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, id);
      expect(sValidateMock).not.toHaveBeenCalled();
   });

   it("composePromptFromTemplate - fieldValues invalid - test", async () => {
      const promptDescriptor =
         dtestData.dPromptTemplateDescriptorWithTemplate();
      promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         promptDescriptor
      );
      const validationResult: FieldsValidationResult = {
         valid: false,
         errors: {
            email: "invalid email",
         },
      };
      sValidateMock.mockReturnValue(validationResult);

      const userId = "user-id-1";
      const { id, promptTemplate } = promptDescriptor;
      const fieldValues: DPromptTemplateFieldValues = {
         email: "invalid-email",
      };

      const fn = () =>
         promptTemplateService.composePromptFromTemplate(
            userId,
            id,
            fieldValues
         );

      await expect(fn).rejects.toThrow("Provided template fields are invalid:");

      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, id);
      expect(sValidateMock).toHaveBeenCalledTimes(1);
      expect(sValidateMock).toHaveBeenCalledWith(
         promptTemplate.fields,
         fieldValues
      );
   });

   it("composePromptFromTemplate - fieldValues valid - test", async () => {
      const promptDescriptor =
         dtestData.dPromptTemplateDescriptorWithTemplate();
      promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         promptDescriptor
      );
      const validationResult: FieldsValidationResult = {
         valid: true,
         errors: {},
      };
      const promptContent = "Hello, your email is test1@email.com.";
      sValidateMock.mockReturnValue(validationResult);
      sReplaceMock.mockReturnValue(promptContent);

      const userId = "user-id-1";
      const { id, promptTemplate } = promptDescriptor;
      const fieldValues: DPromptTemplateFieldValues = {
         email: "test1@email.com",
      };

      const result = await promptTemplateService.composePromptFromTemplate(
         userId,
         id,
         fieldValues
      );

      const expectedResult: DPromptUpdate = {
         content: promptContent,
         title: promptDescriptor.title,
         recommendedModel: promptDescriptor.recommendedModel,
         categories: promptDescriptor.categories.map((cat) => cat.name),
         followUpPrompts: [],
      };

      expect(result).toEqual(expectedResult);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, id);
      expect(sValidateMock).toHaveBeenCalledTimes(1);
      expect(sValidateMock).toHaveBeenCalledWith(
         promptTemplate.fields,
         fieldValues
      );
      expect(sReplaceMock).toHaveBeenCalledTimes(1);
      expect(sReplaceMock).toHaveBeenCalledWith(
         promptTemplate.content,
         fieldValues
      );
   });
});

describe("resolveAllTemplateFields tests", () => {
   const globalFieldToTemplateFieldInternal = (
      gf: DGlobalTemplateField
   ): DPromptTemplateField => {
      return {
         id: gf.id,
         promptTemplateId: "",
         name: gf.name,
         label: gf.label,
         description: gf.description,
         type: gf.type,
         required: gf.required,
         order: gf.order,
         defaultValue: gf.defaultValue,
         options: gf.options,
      };
   };

   const missingVariableToTemplateFieldInternal = (
      name: string,
      index: number
   ): DPromptTemplateField => {
      return {
         id: name,
         promptTemplateId: "",
         name,
         label: name,
         description: null,
         type: "TEXT" as const,
         required: true,
         order: 100 + index,
         defaultValue: null,
      };
   };

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("returns only template fields when all variables have matching fields - test", () => {
      const fields = dtestData.dPromptTemplateFields(2);
      const field1 = fields[0];
      const field2 = fields[1];

      const template = dtestData.dPromptTemplate();
      template.fields = fields;

      sExtractVariablesMock.mockReturnValue([field1.name, field2.name]);

      const result = promptTemplateService.resolveAllTemplateFields(
         template,
         []
      );

      expect(result).toEqual(fields);
   });

   it("returns dummy TEXT fields for all variables when no template fields are defined - test", () => {
      const template = dtestData.dPromptTemplate();
      template.fields = [];
      sExtractVariablesMock.mockReturnValue(["var_a", "var_b"]);

      const result = promptTemplateService.resolveAllTemplateFields(
         template,
         []
      );

      const expectedResult = [
         missingVariableToTemplateFieldInternal("var_a", 0),
         missingVariableToTemplateFieldInternal("var_b", 1),
      ];

      expect(result).toEqual(expectedResult);
   });

   it("adds dummy fields only for variables without a matching template field - test", () => {
      const fields = dtestData.dPromptTemplateFields(1);
      const template = dtestData.dPromptTemplate();
      template.fields = fields;

      sExtractVariablesMock.mockReturnValue([fields[0].name, "missing_var"]);

      const result = promptTemplateService.resolveAllTemplateFields(
         template,
         []
      );

      const expectedResult = [
         ...fields,
         missingVariableToTemplateFieldInternal("missing_var", 0),
      ];

      expect(result).toEqual(expectedResult);
   });

   it("does not add a dummy field for a variable covered by a global field - test", () => {
      const globalField = {
         ...dtestData.dGlobalTemplateField(1),
         name: "global_var",
      };
      const template = dtestData.dPromptTemplate();
      template.fields = [];

      sExtractVariablesMock.mockReturnValue(["global_var"]);

      const result = promptTemplateService.resolveAllTemplateFields(template, [
         globalField,
      ]);

      const expectedResult = [globalFieldToTemplateFieldInternal(globalField)];

      expect(result).toEqual(expectedResult);
   });

   it("returns empty array when content has no variables and no fields exist - test", () => {
      const template = dtestData.dPromptTemplate();
      template.fields = [];

      sExtractVariablesMock.mockReturnValue([]);

      const result = promptTemplateService.resolveAllTemplateFields(
         template,
         []
      );

      expect(result).toEqual([]);
   });

   it("merges template fields, global fields, and dummy fields in correct order - test", () => {
      const templateField = dtestData.dPromptTemplateField(1);
      const globalField = dtestData.dGlobalTemplateField(2);
      globalField.name = "global_field";

      const template = dtestData.dPromptTemplate();
      template.fields = [templateField];

      sExtractVariablesMock.mockReturnValue([
         templateField.name,
         "global_field",
         "extra_var",
      ]);

      const result = promptTemplateService.resolveAllTemplateFields(template, [
         globalField,
      ]);

      const expectedResult = [
         templateField,
         globalFieldToTemplateFieldInternal(globalField),
         missingVariableToTemplateFieldInternal("extra_var", 0),
      ];

      expect(result).toEqual(expectedResult);
   });
});
