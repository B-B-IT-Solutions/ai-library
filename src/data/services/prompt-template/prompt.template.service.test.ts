jest.mock("@/data/repositories/prompt-template");
jest.mock("./template.engine");

import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptTemplateRepository } from "@/data/repositories/prompt-template";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

import { PromptTemplateService } from "./prompt.template.service";
import { FieldsValidationResult, TemplateEngine } from "./template.engine";

const promptTemplateRepo = new PromptTemplateRepository(prisma);
const promptTemplateRepoMock =
   promptTemplateRepo as DeepMockProxy<PromptTemplateRepository>;

const promptTemplateService = new PromptTemplateService(promptTemplateRepoMock);

const sValidate = TemplateEngine.validate;
const sReplace = TemplateEngine.replace;

const sValidateMock = sValidate as jest.MockedFunction<typeof sValidate>;
const sReplaceMock = sReplace as jest.MockedFunction<typeof sReplace>;

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
      const template = dtestData.dPromptTemplateDescriptorWithTemplate();
      promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         template
      );

      const { id } = template;
      const result =
         await promptTemplateService.getPromptTemplateDescriptorWithTemplate(
            id
         );

      expect(result).toEqual(template);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(id);
   });
});

describe("getPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplate - template retrieved - test", async () => {
      const template = dtestData.dPromptTemplate();
      promptTemplateRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const { id } = template;
      const result = await promptTemplateService.getPromptTemplate(id);

      expect(result).toEqual(template);
      expect(promptTemplateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(
         1
      );
      expect(promptTemplateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         id
      );
   });
});

describe("getPromptTemplateCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplateCategories test", async () => {
      const categories = ptestData.pPromptTemplateCategories();
      promptTemplateRepoMock.pGetPromptTemplateCategories.mockResolvedValue(
         categories
      );

      const result = await promptTemplateService.getPromptTemplateCategories();

      expect(result).toEqual(categories);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateCategories
      ).toHaveBeenCalledTimes(1);
   });
});

describe("createPromptTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createPromptTemplateDescriptor - descriptor created - test", async () => {
      const newData = dtestData.dPromptTemplateUpdate();
      const newDescriptor = dtestData.dPromptTemplateDescriptor();
      promptTemplateRepoMock.pCreatePromptTemplateDescriptor.mockResolvedValue(
         newDescriptor
      );

      const result =
         await promptTemplateService.createPromptTemplateDescriptor(newData);

      expect(result).toEqual(newDescriptor);
      expect(
         promptTemplateRepoMock.pCreatePromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pCreatePromptTemplateDescriptor
      ).toHaveBeenCalledWith(newData);
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

      const id = "non-existent-id";
      const fieldValues: DPromptTemplateFieldValues = {};

      const fn = () =>
         promptTemplateService.composePromptFromTemplate(id, fieldValues);

      await expect(fn).rejects.toThrow(
         `PromptTemplateDescriptor with id ${id}not found `
      );

      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(id);
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

      const { id, promptTemplate } = promptDescriptor;
      const fieldValues: DPromptTemplateFieldValues = {
         email: "invalid-email",
      };

      const fn = () =>
         promptTemplateService.composePromptFromTemplate(id, fieldValues);

      await expect(fn).rejects.toThrow("Provided template fields are invalid:");

      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(id);
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

      const { id, promptTemplate } = promptDescriptor;
      const fieldValues: DPromptTemplateFieldValues = {
         email: "test1@email.com",
      };

      const result = await promptTemplateService.composePromptFromTemplate(
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
      ).toHaveBeenCalledWith(id);
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
