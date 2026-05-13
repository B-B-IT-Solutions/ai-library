import { Decimal } from "@prisma/client/runtime/library";
import { range } from "es-toolkit";
import { map } from "es-toolkit/compat";

import { CartWithItems } from "@/data/types/db/cart";
import {
   CatalogEntryWithContent,
   CatalogEntryWithRelations,
} from "@/data/types/db/catalog";
import { PLibraryCollection } from "@/data/types/db/collection";
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
import {
   PromptContentWithFields,
   PromptWithCategories,
   PromptWithTemplate,
} from "@/data/types/db/prompt";
import { Prompt0sPage, Prompt0WithRelations } from "@/data/types/db/prompt0";
import { SubscriptionWithPlan } from "@/data/types/db/subscription";
import { UserUpdateData } from "@/data/types/db/user";
import {
   Cart,
   CartItem,
   CatalogCategory,
   CatalogEntry,
   CatalogEntryContent,
   CatalogEntryField,
   GlobalPromptField,
   LibraryCollectionEntry,
   Order,
   OrderItem,
   PasswordResetToken,
   Product,
   ProductExample,
   ProductFeature,
   ProductInstruction,
   ProductUseCase,
   Prompt,
   Prompt0,
   Prompt0Category,
   Prompt0FollowUp,
   Prompt0Version,
   PromptCategory,
   PromptField,
   PromptGlobalField,
   Subscription,
   SubscriptionHistory,
   SubscriptionPlan,
   User,
   VerificationToken,
} from "@/generated/prisma/client";
import {
   Prompt0CreateInput,
   Prompt0UpdateInput,
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
      stripeCustomerId: `86a092fd-1758-45d1-a831-9b26d6eb837${index}`,
      legalNoticesAcceptedAt: new Date("2025-09-27"),
      iubendaLegalNoticesSynced: true,
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

export const pVerificationToken = (index = 1): VerificationToken => {
   return {
      identifier: `user${index}@email.com`,
      token: `token-${index}`,
      expires: new Date("2025-09-27"),
   };
};

export const pPasswordResetToken = (index = 1): PasswordResetToken => {
   return {
      identifier: `user${index}@email.com`,
      token: `token-${index}`,
      expires: new Date("2025-09-27"),
   };
};

export const pSubscriptionWithPlan = (index = 1): SubscriptionWithPlan => {
   const subscription = pSubscription(index);
   const plan = pSubscriptionPlan(index);
   return {
      ...subscription,
      plan,
   };
};

export const pSubscription = (index = 1): Subscription => {
   return {
      id: `c5387491-1485-4ea2-b6be-72b1d942719${index}`,
      userId: `f08abf0c-5623-454e-bc02-7933a59533b${index}`,
      planId: `df964a3c-bfa2-4484-97c3-219c2158380${index}`,
      status: "ACTIVE",
      billingInterval: "YEARLY",
      stripeSubscriptionId: `982a1b4c-e85b-4885-98c5-62fbea319e5${index}`,
      stripeCustomerId: `ac82ecc9-de60-4fba-acf6-8b57ad9a91a${index}`,
      stripeCheckoutSessionId: `3a8d4246-480e-43f8-bfa1-a167658b81af${index}`,
      currentPeriodStart: new Date("2025-09-27"),
      currentPeriodEnd: new Date("2025-09-27"),
      cancelAtPeriodEnd: false,
      canceledAt: new Date("2025-09-27"),
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pSubscriptionPlans = (count = 3): SubscriptionPlan[] => {
   return range(0, count).map((i) => pSubscriptionPlan(i));
};

export const pSubscriptionPlan = (index = 1): SubscriptionPlan => {
   return {
      id: `df964a3c-bfa2-4484-97c3-219c2158380${index}`,
      tier: index % 2 === 0 ? "BASIC" : "PRO",
      name: `name-${index}`,
      description: `description-${index}`,
      monthlyPrice: new Decimal(9.99),
      yearlyPrice: new Decimal(99.99),
      stripePriceIdMonthly: `22a0af93-3fec-41e6-9a4e-96c832d4c40${index}`,
      stripePriceIdYearly: `9df90f95-b6fb-4774-bd58-04ac4039788${index}`,
      stripeProductId: `d48fabe0-8c26-4dcf-959a-f87b15e3efb${index}`,
      features: {
         maxPrompts: 5,
         maxLibraryItems: 3,
         canAccessMarketplace: true,
         canPurchaseItems: false,
         canExportPrompts: false,
         canUseAdvancedFeatures: false,
      },
      isActive: true,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pSubscriptionHistories = (count = 3): SubscriptionHistory[] => {
   return range(0, count).map((i) => pSubscriptionHistory(i));
};

export const pSubscriptionHistory = (index = 1): SubscriptionHistory => {
   return {
      id: `5a2739cf-4c88-4a01-9555-3a9bbb0cd55${index}`,
      userId: `f08abf0c-5623-454e-bc02-7933a59533b${index}`,
      eventType: "SUBSCRIPTION_CREATED",
      fromTier: null,
      toTier: "BASIC",
      fromStatus: null,
      toStatus: "ACTIVE" as const,
      stripeEventId: `38d65fc2-7fef-4917-8aae-b47a04d770c${index}`,
      metadata: {},
      createdAt: new Date("2025-09-27"),
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
   const template = pPromptWithCategories(index);
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
      status: "PENDING",
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

export const pTemplateCollections = (count = 3): PLibraryCollection[] => {
   return range(0, count).map((i) => pTemplateCollection(i));
};

export const pTemplateCollection = (index = 1): PLibraryCollection => {
   return {
      id: `457bf695-6f74-44aa-9b3a-e179ea9e817${index}`,
      userId: `037c87e0-9bbe-4529-9fea-f8ae91c65d9${index}`,
      name: `name ${index}`,
      description: `description ${index}`,
      color: index % 2 ? null : `color ${index}`,
      order: index,
      isPublic: index % 2 == 0,
      publicToken: `token-${index}`,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
      _count: {
         entries: index * 10,
      },
   };
};

export const pTemplateCollectionEntries = (
   count = 3
): LibraryCollectionEntry[] => {
   return range(0, count).map((i) => pTemplateCollectionEntry(i));
};

export const pTemplateCollectionEntry = (index = 1): LibraryCollectionEntry => {
   return {
      id: `f25ed912-b2f0-4a40-876c-44dae253446${index}`,
      collectionId: `457bf695-6f74-44aa-9b3a-e179ea9e817${index}`,
      templateDescriptorId: `334db648-f300-4284-8149-075ff465d75${index}`,
      userId: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`,
      addedAt: new Date("2025-09-27"),
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

export const pPromptWithTemplate = (index = 1): PromptWithTemplate => {
   const templateDescriptor = pPromptWithCategories(index);
   const promptContent = pPromptTemplate(index);
   return {
      ...templateDescriptor,
      promptContent,
   };
};

export const pPromptsWithCategories = (count = 3): PromptWithCategories[] => {
   return range(0, count).map((i) => pPromptWithCategories(i));
};

export const pPromptWithCategories = (index = 1): PromptWithCategories => {
   const templateDescriptor = pPrompt(index);
   const categories = pPromptTemplateCategories();
   return {
      ...templateDescriptor,
      categories,
   };
};

export const pPrompts = (count = 3): Prompt[] => {
   return range(0, count).map((i) => pPrompt(i));
};

export const pPrompt = (index = 1): Prompt => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      userId: `819855b3-1477-4255-b6cd-08fea96aaf1${index}`,
      title: `title ${index}`,
      description: `description ${index}`,
      recommendedModel: `model ${index}`,
      isFavorite: index % 2 == 0,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptTemplate = (index = 1): PromptContentWithFields => {
   return {
      promptId: `8b82ebb2-5966-4788-8fed-3ad18c08e28${index}`,
      content: `content ${index}`,
      fields: pPromptFields(3),
      globalFields: pPromptGlobalFields(),
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptFields = (count = 3): PromptField[] => {
   return range(0, count).map((i) => pPromptField(i));
};

export const pPromptField = (index = 1): PromptField => {
   return {
      id: `7e736436-8c94-4ec9-bd21-1db1b52d357${index}`,
      promptId: `8b82ebb2-5966-4788-8fed-3ad18c08e28${index}`,
      name: `field ${index}`,
      label: `label ${index}`,
      description: `description ${index}`,
      type: "SELECT",
      required: true,
      order: index,
      options: ["option 1", "option 2", "option 3"],
      defaultValue: "option 1",
   };
};

export const pPromptTemplateCategories = (count = 3): PromptCategory[] => {
   return range(0, count).map((i) => pPromptCategory(i));
};

export const pPromptCategory = (index = 1): PromptCategory => {
   return {
      id: Math.random(),
      userId: `819855b3-1477-4255-b6cd-08fea96aaf1${index}`,
      name: `category ${index}`,
   };
};

export const pPromptDescriptorsPage = (): Prompt0sPage => {
   const descriptors = pPromptDescriptorsWithRelations();
   return {
      content: descriptors,
      numberOfElements: descriptors.length,
      pageNumber: 1,
      pageSize: 3,
      totalElements: 15,
      totalPages: 5,
   };
};

export const pPromptDescriptorsWithRelations = (
   count = 3
): Prompt0WithRelations[] => {
   return range(0, count).map((i) => pPromptDescriptorWithRelations(i));
};

export const pPromptDescriptorWithRelations = (
   index = 1
): Prompt0WithRelations => {
   const descriptor = pPromptDescriptor(index);
   const categories = pPrompt0Categories();
   const promptFollowUps = pPromptFollowUps();
   const versions = pPromptVersions();
   return {
      ...descriptor,
      categories,
      followUpPrompts: promptFollowUps,
      versions,
   };
};

export const pPromptDescriptors = (count = 3): Prompt0[] => {
   return range(0, count).map((i) => pPromptDescriptor(i));
};

export const pPromptDescriptor = (index = 1): Prompt0 => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      userId: `819855b3-1477-4255-b6cd-08fea96aaf1${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      recommendedModel: `model ${index}`,
      isFavorite: true,
      currentVersion: index,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptDescriptorCreateInput = (index = 1): Prompt0CreateInput => {
   return {
      title: `title ${index}`,
      content: `content ${index}`,
      recommendedModel: `model ${index}`,
      isFavorite: true,
      user: {
         connect: {
            id: `819855b3-1477-4255-b6cd-08fea96aaf1${index}`,
         },
      },
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptDescriptorUpdateInput = (index = 1): Prompt0UpdateInput => {
   return {
      content: `content ${index}`,
      title: `title ${index}`,
      recommendedModel: `model ${index}`,
      isFavorite: true,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPrompt0Categories = (count = 3): Prompt0Category[] => {
   return range(0, count).map((i) => pPrompt0Category(i));
};

export const pPrompt0Category = (index = 1): Prompt0Category => {
   return {
      id: Math.random(),
      userId: `819855b3-1477-4255-b6cd-08fea96aaf1${index}`,
      name: `category ${index}`,
   };
};

export const pPromptFollowUps = (count = 3): Prompt0FollowUp[] => {
   return range(0, count).map((i) => pPromptFollowUp(i));
};

export const pPromptFollowUp = (index = 1): Prompt0FollowUp => {
   return {
      id: `f23c15c7-7d2d-40a2-a895-6a78516b9b3${index}`,
      promptId: `334db648-f300-4284-8149-075ff465d75${index}`,
      content: `content ${index}`,
      order: index,
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptVersions = (count = 3): Prompt0Version[] => {
   return range(0, count).map((i) => pPromptVersion(i));
};

export const pPromptVersion = (index = 1): Prompt0Version => {
   return {
      id: `db4079a0-c783-4d41-9bb3-0a1c45edeb7${index}`,
      promptId: `334db648-f300-4284-8149-075ff465d75${index}`,
      version: index,
      content: `content ${index}`,
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptGlobalFields = (count = 3): PromptGlobalField[] => {
   return range(0, count).map((i) => pPromptGlobalField(i));
};

export const pPromptGlobalField = (index = 1): PromptGlobalField => {
   return {
      globalFieldId: `global-field-id-${index}`,
      promptId: `334db648-f300-4284-8149-075ff465d75${index}`,
      order: index,
   };
};

export const pGlobalPromptFields = (count = 3): GlobalPromptField[] => {
   return range(0, count).map((i) => pGlobalPromptField(i));
};

export const pGlobalPromptField = (index = 1): GlobalPromptField => {
   return {
      id: `global-field-id-${index}`,
      userId: `334db648-f300-4284-8149-075ff465d75${index}`,
      name: `name-${index}`,
      label: `Label ${index}`,
      description: `description ${index}`,
      type: "SELECT",
      required: true,
      defaultValue: `default-${index}`,
      options: [
         `option ${index}`,
         `option ${index + 1}`,
         `option ${index + 2}`,
      ],
      order: index,
      createdAt: new Date("2025-09-27"),
      updatedAt: new Date("2025-09-27"),
   };
};

export const pCatalogEntriesWithContent = (
   count = 3
): CatalogEntryWithContent[] => {
   return range(0, count).map((i) => pCatalogEntryWithContent(i + 1));
};

export const pCatalogEntryWithContent = (
   index = 1
): CatalogEntryWithContent => {
   const entry = pCatalogEntryWithRelations(index);
   return {
      ...entry,
      content: pCatalogEntryContent(index, entry.id),
   };
};

export const pCatalogEntriesWithRelations = (
   count = 3
): CatalogEntryWithRelations[] => {
   return range(0, count).map((i) => pCatalogEntryWithRelations(i + 1));
};

export const pCatalogEntryWithRelations = (
   index = 1
): CatalogEntryWithRelations => {
   const entry = pCatalogEntry(index);
   return {
      ...entry,
      category: pCatalogCategory(index),
      fields: pCatalogEntryFields(3, entry.id),
   };
};

export const pCatalogEntry = (index = 1): CatalogEntry => {
   return {
      id: `entry-uuid-000${index}`,
      slug: `catalog-entry-${index}`,
      title: `Catalog Entry ${index}`,
      description: `Description for catalog entry ${index}`,
      recommendedModel: "GPT-4o",
      status: "PUBLISHED",
      categoryId: `cat-uuid-000${index}`,
      copyCount: index * 5,
      publishedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
      updatedAt: new Date("2025-09-27"),
   };
};

export const pCatalogEntryContent = (
   index = 1,
   catalogEntryId = "entry-uuid-0001"
): CatalogEntryContent => {
   return {
      catalogEntryId,
      content: `Template content with {{field_${index}}} placeholder`,
   };
};

export const pCatalogEntryFields = (
   count = 3,
   catalogEntryId = "entry-uuid-0001"
): CatalogEntryField[] => {
   return range(0, count).map((i) => pCatalogEntryField(i + 1, catalogEntryId));
};

export const pCatalogEntryField = (
   index = 1,
   catalogEntryId = "entry-uuid-0001"
): CatalogEntryField => {
   return {
      id: `field-uuid-000${index}`,
      catalogEntryId,
      name: `field_${index}`,
      label: `Field Label ${index}`,
      description: `Field description ${index}`,
      type: "TEXT",
      required: true,
      order: index,
      defaultValue: null,
      options: null,
   };
};

export const pCatalogCategories = (count = 3): CatalogCategory[] => {
   return range(0, count).map((i) => pCatalogCategory(i + 1));
};

export const pCatalogCategory = (index = 1): CatalogCategory => {
   return {
      id: `cat-uuid-000${index}`,
      name: `Category ${index}`,
      slug: `category-${index}`,
      description: `Description for category ${index}`,
      order: index,
      createdAt: new Date("2025-09-27"),
      updatedAt: new Date("2025-09-27"),
   };
};
