import { range } from "es-toolkit";

import { Sort } from "@/data/types/common";
import { DCart, DCartItem } from "@/data/types/domain/cart";
import { DBundleItem, DProduct } from "@/data/types/domain/product";
import {
   DPrompt,
   DPromptCategory,
   DPromptCreate,
   DPromptsFilter,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptVersion,
} from "@/data/types/domain/prompt";
import {
   DPromptTemplate,
   DPromptTemplateCategory,
} from "@/data/types/domain/prompt.template";
import { DUserUpdateData } from "@/data/types/domain/user";
import { LoginUser } from "@/data/types/next-auth";

export const dLoginUser = (index = 1): LoginUser => {
   return { id: `user-${index}`, email: "test@email.com" };
};

export const dUserUpdateData = (index = 1): DUserUpdateData => {
   return {
      name: `User ${index}`,
   };
};

export const dCart = (index = 1, itemsCount = 3): DCart => {
   return {
      id: `10fbd76c-4fd4-4294-a541-5d96e6a8e84${index}`,
      userId: "user-1",
      sessionCartId: null,
      subtotal: itemsCount * 19.99,
      total: itemsCount * 19.99,
      items: dCartItems(itemsCount),
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dCartItems = (count = 3): DCartItem[] => {
   return range(0, count).map((i) => dCartItem(i));
};

export const dCartItem = (index = 1): DCartItem => {
   return {
      id: `528b2f07-3142-48e3-9e5d-5a6a83789e95${index}`,
      cartId: `10fbd76c-4fd4-4294-a541-5d96e6a8e84${index}`,
      productId: `334db648-f300-4284-8149-075ff465d75${index}`,
      productName: `name ${index}`,
      productType: "BUNDLE",
      productPrice: 19.99,
      lineTotal: 19.99,
      quantity: 1,
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dProducts = (count = 3): DProduct[] => {
   return range(0, count).map((i) => dProduct(i));
};

export const dProduct = (index = 1): DProduct => {
   const template = dPromptTemplate(1);

   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      name: `name ${index}`,
      description: `description ${index}`,
      price: 59.99,
      type: "BUNDLE",
      status: "ACTIVE",
      templateId: template.id,
      template: template,
      bundleItems: dBundleItems(),
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dBundleItems = (count = 3): DBundleItem[] => {
   return range(0, count).map((i) => dBundleItem(i));
};

export const dBundleItem = (index = 1): DBundleItem => {
   const template = dPromptTemplate(index);
   return {
      id: `418c5cf3-d0d5-4ad8-a841-d458c8aa6cb1${index}`,
      bundleId: `2cabc8ff-010a-4b0b-93c6-4f311d35c432${index}`,
      templateId: template.id,
      template,
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptTemplates = (count = 3): DPromptTemplate[] => {
   return range(0, count).map((i) => dPromptTemplate(i));
};

export const dPromptTemplate = (index = 1): DPromptTemplate => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      categories: dPromptTemplateCategories(),
      recommendedModel: `model ${index}`,
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptTemplateCategories = (
   count = 3
): DPromptTemplateCategory[] => {
   return range(0, count).map((i) => dPromptTemplateCategory(i));
};

export const dPromptTemplateCategory = (index = 1): DPromptTemplateCategory => {
   return {
      name: `category ${index}`,
   };
};

export const dPromptsPage = (): DPromptsPage => {
   const prompts = dPrompts();
   return {
      content: prompts,
      numberOfElements: prompts.length,
      pageNumber: 1,
      pageSize: 3,
      totalElements: 15,
      totalPages: 5,
   };
};

export const dPrompts = (count = 3): DPrompt[] => {
   return range(0, count).map((i) => dPrompt(i));
};

export const dPrompt = (index = 1): DPrompt => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      categories: dPromptCategories(),
      recommendedModel: `model ${index}`,
      followUpPrompts: [
         "follow up prompt 1",
         "follow up prompt 2",
         "follow up prompt 3",
      ],
      isFavorite: true,
      currentVersion: 1,
      versions: dPromptVersions(),
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptCreate = (index = 1): DPromptCreate => {
   return {
      title: `title ${index}`,
      content: `content ${index}`,
      categories: ["category 1"],
      recommendedModel: `model ${index}`,
      followUpPrompts: [
         "follow up prompt 1",
         "follow up prompt 2",
         "follow up prompt 3",
      ],
   };
};

export const dPromptCategories = (count = 3): DPromptCategory[] => {
   return range(0, count).map((i) => dPromptTemplateCategory(i));
};

export const dPromptCategory = (index = 1): DPromptCategory => {
   return {
      name: `category ${index}`,
   };
};

export const dPromptVersions = (count = 3): DPromptVersion[] => {
   return range(0, count).map((i) => dPromptVersion(i));
};

export const dPromptVersion = (index = 1): DPromptVersion => {
   return {
      version: index,
      content: `content ${index}`,
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptsPageQuery = (): DPromptsPageQuery => {
   return {
      pagination: {
         pageNumber: 15,
         pageSize: 5,
      },
      filter: dPromptsFilter(),
      globalFilter: "test 1",
   };
};

export const dPromptsFilter = (): DPromptsFilter => {
   return {
      categories: ["cat 1", "cat 2", "cat 3"],
   };
};

export const sort = (field = "field1", desc = false): Sort => {
   return { field, desc };
};
