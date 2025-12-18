import { Decimal } from "@prisma/client/runtime/library";
import { range } from "es-toolkit";

import { PromptsPage, PromptWithCategories } from "@/data/types/db/prompt";
import { PromptTemplateWithCategories } from "@/data/types/db/prompt.template";
import { UserUpdateData } from "@/data/types/db/user";
import { Order } from "@/generated/prisma/browser";
import {
   Cart,
   CartItem,
   Prompt,
   PromptCategory,
   PromptTemplate,
   PromptTemplateCategory,
   User,
} from "@/generated/prisma/client";
import {
   PromptCreateInput,
   PromptUpdateInput,
} from "@/generated/prisma/models";

export const pUser = (index = 1): User => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      name: `User ${index}`,
      email: `user${index}@email.com`,
      emailVerified: new Date("2025-09-27"),
      image: "image/1",
      password: "password123",
      role: "user",
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pUserUpdateData = (index = 1): UserUpdateData => {
   return {
      name: `User ${index}`,
      emailVerified: new Date("2025-09-27"),
      image: "image/1",
      password: "password123",
      paymentMethod: "stripe",
      role: "user",
   };
};

export const pOrder = (index = 1): Order => {
   return {
      id: `fa1d3c35-ea07-489f-b8c8-62fa8514130${index}`,
      userId: `334db648-f300-4284-8149-075ff465d75${index}`,
      status: "PENDING",
      totalAmount: new Decimal(27.99),
      paymentMethod: "card",
      stripeCheckoutSessionId: `04106289-9dc4-47cb-ba81-c3eb5677645${index}`,
      stripePaymentIntentId: `1f6fffb4-00f5-4d8c-9202-5c0d5044c30${index}`,
      stripePaymentStatus: "PENDING",
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pCart = (index = 1): Cart => {
   return {
      id: `10fbd76c-4fd4-4294-a541-5d96e6a8e84${index}`,
      userId: `334db648-f300-4284-8149-075ff465d75${index}`,
      sessionCartId: `4fe9285e-a420-453b-9237-9443c865570${index}`,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pCartItems = (count = 3): CartItem[] => {
   return range(0, count).map((i) => pCartItem(i));
};

export const pCartItem = (index = 1): CartItem => {
   return {
      id: `528b2f07-3142-48e3-9e5d-5a6a83789e95${index}`,
      cartId: `10fbd76c-4fd4-4294-a541-5d96e6a8e84${index}`,
      productId: `1045dc94-2eff-4150-804b-be38fa1422b${index}`,
      quantity: 1,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptTemplatesWithCategories = (
   count = 3
): PromptTemplateWithCategories[] => {
   return range(0, count).map((i) => pPromptTemplateWithCategories(i));
};

export const pPromptTemplateWithCategories = (
   index = 1
): PromptTemplateWithCategories => {
   const template = pPromptTemplate(index);
   const categories = pPromptTemplateCategories();
   return {
      ...template,
      categories,
   };
};

export const pPromptTemplates = (count = 3): PromptTemplate[] => {
   return range(0, count).map((i) => pPromptTemplate(i));
};

export const pPromptTemplate = (index = 1): PromptTemplate => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      recommendedModel: `model ${index}`,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptTemplateCategories = (
   count = 3
): PromptTemplateCategory[] => {
   return range(0, count).map((i) => pPromptTemplateCategory(i));
};

export const pPromptTemplateCategory = (index = 1): PromptTemplateCategory => {
   return {
      id: Math.random(),
      name: `category ${index}`,
   };
};

export const pPromptsPage = (): PromptsPage => {
   const prompts = pPromptsWithCategories();
   return {
      content: prompts,
      numberOfElements: prompts.length,
      pageNumber: 1,
      pageSize: 3,
      totalElements: 15,
      totalPages: 5,
   };
};

export const pPromptsWithCategories = (count = 3): PromptWithCategories[] => {
   return range(0, count).map((i) => pPromptWithCategories(i));
};

export const pPromptWithCategories = (index = 1): PromptWithCategories => {
   const template = pPrompt(index);
   const categories = pPromptCategories();
   return {
      ...template,
      categories,
   };
};

export const pPrompts = (count = 3): Prompt[] => {
   return range(0, count).map((i) => pPrompt(i));
};

export const pPrompt = (index = 1): Prompt => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      recommendedModel: `model ${index}`,
      followUpPrompts: [
         "follow up prompt 1",
         "follow up prompt 2",
         "follow up prompt 3",
      ],
      isFavorite: true,
      currentVersion: 1,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptCreateInput = (index = 1): PromptCreateInput => {
   return {
      title: `title ${index}`,
      content: `content ${index}`,
      categories: {
         connectOrCreate: [
            {
               where: {
                  name: `category ${index}`,
               },
               create: {
                  name: `category ${index}`,
               },
            },
         ],
      },
      recommendedModel: `model ${index}`,
      followUpPrompts: [
         "follow up prompt 1",
         "follow up prompt 2",
         "follow up prompt 3",
      ],
      isFavorite: true,
      currentVersion: 1,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptUpdateInput = (index = 1): PromptUpdateInput => {
   return {
      title: `title ${index}`,
      content: `content ${index}`,
      categories: {
         connectOrCreate: [
            {
               where: {
                  name: `category ${index}`,
               },
               create: {
                  name: `category ${index}`,
               },
            },
         ],
      },
      recommendedModel: `model ${index}`,
      followUpPrompts: [
         "follow up prompt 1",
         "follow up prompt 2",
         "follow up prompt 3",
      ],
      isFavorite: true,
      currentVersion: 2,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptCategories = (count = 3): PromptCategory[] => {
   return range(0, count).map((i) => pPromptCategory(i));
};

export const pPromptCategory = (index = 1): PromptCategory => {
   return {
      id: Math.random(),
      name: `category ${index}`,
   };
};
