import { Decimal } from "@prisma/client/runtime/library";
import { range } from "es-toolkit";
import { map } from "es-toolkit/compat";

import { CartWithItems } from "@/data/types/db/cart";
import { LibraryEntryWithTemplate } from "@/data/types/db/library";
import {
   OrderItemProduct,
   OrderProducts,
   OrderWithItems,
} from "@/data/types/db/order";
import {
   ProductItemWithTemplate,
   ProductWithDetails,
   ProductWithItems,
} from "@/data/types/db/product";
import { PromptsPage, PromptWithCategories } from "@/data/types/db/prompt";
import { PromptTemplateWithCategories } from "@/data/types/db/prompt.template";
import { UserUpdateData } from "@/data/types/db/user";
import { Order } from "@/generated/prisma/browser";
import {
   Cart,
   CartItem,
   LibraryEntry,
   OrderItem,
   Product,
   ProductExample,
   ProductFeature,
   ProductInstruction,
   ProductUseCase,
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

export const pProductWithDetails = (index = 1): ProductWithDetails => {
   const product = pProductWithItems(index);
   return {
      ...product,
      features: pFeatures(),
      useCases: pUseCases(),
      examples: pExamples(),
      instructions: pInstructions(),
   };
};

export const pProductsWithItems = (count = 3): ProductWithItems[] => {
   return range(0, count).map((i) => pProductWithItems(i));
};

export const pProductWithItems = (index = 1): ProductWithItems => {
   const product = pProduct(index);
   return {
      ...product,
      productItems: pProductItems(),
   };
};

export const pProductItems = (count = 3): ProductItemWithTemplate[] => {
   return range(0, count).map((i) => pProductItem(i));
};

export const pProductItem = (index = 1): ProductItemWithTemplate => {
   const template = pPromptTemplateWithCategories(index);
   return {
      id: `418c5cf3-d0d5-4ad8-a841-d458c8aa6cb1${index}`,
      productId: `2cabc8ff-010a-4b0b-93c6-4f311d35c432${index}`,
      templateId: template.id,
      template,
      createdAt: new Date("2025-09-27"),
   };
};

export const pFeatures = (count = 3): ProductFeature[] => {
   return range(0, count).map((i) => pFeature(i));
};

export const pFeature = (index = 1): ProductFeature => {
   return {
      id: `be263d01-1d38-4781-9c52-16b0280d92b${index}`,
      productId: `2bf4776e-409e-4eb5-81d3-700fcf27bfb${index}`,
      icon: `Check`,
      title: `title ${index}`,
      description: `description ${index}`,
      order: index,
      createdAt: new Date("2025-09-27"),
   };
};

export const pUseCases = (count = 3): ProductUseCase[] => {
   return range(0, count).map((i) => pUseCase(i));
};

export const pUseCase = (index = 1): ProductUseCase => {
   return {
      id: `7d5bcac6-b650-4a07-ba2d-27c3b8f32cc${index}`,
      productId: `2bf4776e-409e-4eb5-81d3-700fcf27bfb${index}`,
      category: `category 1`,
      description: `description ${index}`,
      tags: ["tag 1", "tag 2", "tag 3"],
      order: index,
      createdAt: new Date("2025-09-27"),
   };
};

export const pExamples = (count = 3): ProductExample[] => {
   return range(0, count).map((i) => pExample(i));
};

export const pExample = (index = 1): ProductExample => {
   return {
      id: `a135945f-5579-4578-91d9-3b5a700b7ba${index}`,
      productId: `2bf4776e-409e-4eb5-81d3-700fcf27bfb${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      order: index,
      createdAt: new Date("2025-09-27"),
   };
};

export const pInstructions = (count = 3): ProductInstruction[] => {
   return range(0, count).map((i) => pInstruction(i));
};

export const pInstruction = (index = 1): ProductInstruction => {
   return {
      id: `837b2e07-a123-4646-993b-28ea8e9a6f4${index}`,
      productId: `2bf4776e-409e-4eb5-81d3-700fcf27bfb${index}`,
      title: `title ${index}`,
      description: `description ${index}`,
      step: index,
      createdAt: new Date("2025-09-27"),
   };
};

export const pProducts = (count = 3): Product[] => {
   return range(0, count).map((i) => pProduct(i));
};

export const pProduct = (index = 1): Product => {
   return {
      id: `1045dc94-2eff-4150-804b-be38fa1422b${index}`,
      name: `Product ${index}`,
      description: `Product Description ${index}`,
      price: new Decimal(29.99),
      discountAmount: new Decimal(7.98),
      type: "TEMPLATE",
      status: "ACTIVE",
      createdAt: new Date("2025-09-27"),
      updatedAt: new Date("2025-09-27"),
   };
};

export const pCartWithItems = (index = 1, itemCount = 2): CartWithItems => {
   const cart = pCart(index);
   const items = pCartItems(itemCount);
   return {
      ...cart,
      items,
   };
};

export const pOrderProducts = (index = 1, count = 3): OrderProducts => {
   const order = pOrder(index);
   const items = pOrderItemProducts(count);
   return {
      id: order.id,
      userId: order.userId,
      items,
   };
};

export const pOrderItemProducts = (count = 3): OrderItemProduct[] => {
   return range(0, count).map((i) => pOrderItemProduct(i));
};

export const pOrderItemProduct = (index = 1, count = 3): OrderItemProduct => {
   const product = pProduct(index);
   const items = pProductItems(count);
   const itemTemplateIds = map(items, (i) => ({
      templateId: i.templateId,
   }));

   return {
      product: {
         id: product.id,
         productItems: itemTemplateIds,
      },
   };
};

export const pOrdersWithItems = (count = 3): OrderWithItems[] => {
   return range(0, count).map((i) => pOrderWithItems(i));
};

export const pOrderWithItems = (index = 1, itemCount = 3): OrderWithItems => {
   const order = pOrder(index);
   const items = pOrderItems(itemCount);
   return {
      ...order,
      items,
   };
};

export const pOrder = (index = 1): Order => {
   return {
      id: `fa1d3c35-ea07-489f-b8c8-62fa8514130${index}`,
      userId: `334db648-f300-4284-8149-075ff465d75${index}`,
      status: "PENDING",
      totalAmount: new Decimal(29.99),
      paymentMethod: "card",
      stripeCheckoutSessionId: `04106289-9dc4-47cb-ba81-c3eb5677645${index}`,
      stripePaymentIntentId: `1f6fffb4-00f5-4d8c-9202-5c0d5044c30${index}`,
      stripePaymentStatus: "PENDING",
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pOrderItems = (count = 3): OrderItem[] => {
   return range(0, count).map((i) => pOrderItem(i));
};

export const pOrderItem = (index = 1): OrderItem => {
   return {
      id: `order-item-${index}`,
      orderId: `fa1d3c35-ea07-489f-b8c8-62fa8514130${index}`,
      productId: `1045dc94-2eff-4150-804b-be38fa1422b${index}`,
      productName: `name ${index}`,
      productDescription: `description ${index}`,
      productType: "TEMPLATE",
      quantity: 1,
      price: new Decimal(29.99),
      createdAt: new Date("2025-09-27"),
   };
};

export const pLibraryEntriesWithTemplate = (
   count = 3
): LibraryEntryWithTemplate[] => {
   return range(0, count).map((i) => pLibraryEntryWithTemplate(i));
};

export const pLibraryEntryWithTemplate = (
   index = 1
): LibraryEntryWithTemplate => {
   const template = pPromptTemplateWithCategories(index);
   return {
      id: `library-entry-${index}`,
      orderId: `2d4daf38-5571-4c0a-9d32-4435bdf6280${index}`,
      userId: `037c87e0-9bbe-4529-9fea-f8ae91c65d9${index}`,
      templateId: `52e59bcf-7651-45f8-91bf-63b8a4e06d8${index}`,
      productId: `419682c2-d8be-433e-a15f-f7ab3663346${index}`,
      template,
      createdAt: new Date("2025-09-27"),
   };
};

export const pLibraryEntries = (count = 3): LibraryEntry[] => {
   return range(0, count).map((i) => pLibraryEntry(i));
};

export const pLibraryEntry = (index = 1): LibraryEntry => {
   return {
      id: `library-entry-${index}`,
      orderId: `2d4daf38-5571-4c0a-9d32-4435bdf6280${index}`,
      userId: `037c87e0-9bbe-4529-9fea-f8ae91c65d9${index}`,
      templateId: `52e59bcf-7651-45f8-91bf-63b8a4e06d8${index}`,
      productId: `419682c2-d8be-433e-a15f-f7ab3663346${index}`,
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
      productName: `name ${index}`,
      productDescription: `description ${index}`,
      productType: "TEMPLATE",
      productPrice: new Decimal(19.99),
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
