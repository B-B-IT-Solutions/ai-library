import { range } from "es-toolkit";

import { Sort } from "@/data/types/common";
import { DCart, DCartItem } from "@/data/types/domain/cart";
import {
   DLibraryEntry,
   DLibraryEntryWithPromptTemplate,
} from "@/data/types/domain/library";
import {
   DOrder,
   DOrderCreate,
   DOrderItem,
   DOrderItemCreate,
   DOrderUpdate,
} from "@/data/types/domain/order";
import {
   DExample,
   DFeature,
   DInstruction,
   DProduct,
   DProductItem,
   DUseCase,
} from "@/data/types/domain/product";
import {
   DPromptCategory,
   DPromptDescriptor,
   DPromptDescriptorsFilter,
   DPromptDescriptorsPage,
   DPromptDescriptorsPageQuery,
   DPromptFollowUp,
   DPromptUpdate,
   DPromptVersion,
} from "@/data/types/domain/prompt";
import {
   DPromptTemplate,
   DPromptTemplateCategory,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateField,
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import {
   DStripeBillingPortalSessionResponse,
   DStripeCheckoutResponse,
} from "@/data/types/domain/stripe";
import {
   DSubscription,
   DSubscriptionCreate,
   DSubscriptionHistoryCreate,
   DSubscriptionPlan,
   DSubscriptionUpdate,
} from "@/data/types/domain/subscription";
import {
   DUser,
   DUserCreate,
   DUserInternal,
   DUserUpdate,
} from "@/data/types/domain/user";
import { LoginUser } from "@/data/types/next-auth";

export const dLoginUser = (index = 1): LoginUser => {
   return {
      id: `user-${index}`,
      name: `User Name ${index}`,
      email: "test@email.com",
   };
};

export const dUser = (index = 1): DUser => {
   return {
      id: `f08abf0c-5623-454e-bc02-7933a59533b${index}`,
      name: `name-${index}`,
      email: "test@email.com",
      role: `role-${index}`,
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dUserInternal = (index = 1): DUserInternal => {
   const user = dUser(index);
   return {
      ...user,
      password: `password-${index}`,
      stripeCustomerId: `ac82ecc9-de60-4fba-acf6-8b57ad9a91a${index}`,
   };
};

export const dStripeCheckoutResponse = (index = 1): DStripeCheckoutResponse => {
   return {
      sessionId: `5f367e25-12a4-4de4-af0b-6dcdd5ac005${index}`,
      url: `http://checkout.stripe/subcription-${index}`,
   };
};

export const dStripeBillingPortalSessionResponse = (
   index = 1
): DStripeBillingPortalSessionResponse => {
   return {
      url: `https://billing.stripe.com/session/123-${index}`,
   };
};

export const dSubscription = (index = 1): DSubscription => {
   return {
      id: `c5387491-1485-4ea2-b6be-72b1d942719${index}`,
      userId: `f08abf0c-5623-454e-bc02-7933a59533b${index}`,
      planId: `df964a3c-bfa2-4484-97c3-219c2158380${index}`,
      status: "ACTIVE",
      billingInterval: "YEARLY",
      stripeSubscriptionId: `982a1b4c-e85b-4885-98c5-62fbea319e5${index}`,
      stripeCustomerId: `ac82ecc9-de60-4fba-acf6-8b57ad9a91a${index}`,
      stripeCheckoutSessionId: `3a8d4246-480e-43f8-bfa1-a167658b81af${index}`,
      currentPeriodStart: new Date("2025-09-27").toISOString(),
      currentPeriodEnd: new Date("2025-09-27").toISOString(),
      cancelAtPeriodEnd: false,
      plan: dSubscriptionPlan(index),
      canceledAt: new Date("2025-09-27").toISOString(),
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dSubscriptionPlans = (count = 3): DSubscriptionPlan[] => {
   return range(0, count).map((i) => dSubscriptionPlan(i));
};

export const dSubscriptionPlan = (index = 1): DSubscriptionPlan => {
   return {
      id: `df964a3c-bfa2-4484-97c3-219c2158380${index}`,
      tier: index % 2 === 0 ? "BASIC" : "PRO",
      name: `name-${index}`,
      description: `description-${index}`,
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
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
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dSubscriptionCreate = (index = 1): DSubscriptionCreate => {
   return {
      userId: `f08abf0c-5623-454e-bc02-7933a59533b${index}`,
      planId: `df964a3c-bfa2-4484-97c3-219c2158380${index}`,
      billingInterval: "YEARLY",
      stripeCustomerId: `ac82ecc9-de60-4fba-acf6-8b57ad9a91a${index}`,
      stripeCheckoutSessionId: `3a8d4246-480e-43f8-bfa1-a167658b81af${index}`,
   };
};

export const dSubscriptionUpdate = (index = 1): DSubscriptionUpdate => {
   return {
      status: "ACTIVE",
      stripeSubscriptionId: `982a1b4c-e85b-4885-98c5-62fbea319e5${index}`,
      stripeCustomerId: `ac82ecc9-de60-4fba-acf6-8b57ad9a91a${index}`,
      stripeCheckoutSessionId: `3a8d4246-480e-43f8-bfa1-a167658b81af${index}`,
      currentPeriodStart: new Date("2025-09-27"),
      currentPeriodEnd: new Date("2025-09-27"),
      cancelAtPeriodEnd: false,
      canceledAt: new Date("2025-09-27"),
   };
};

export const dSubscriptionHistoryCreate = (
   index = 1
): DSubscriptionHistoryCreate => {
   return {
      userId: `f08abf0c-5623-454e-bc02-7933a59533b${index}`,
      eventType: "SUBSCRIPTION_CREATED",
      fromTier: "BASIC",
      toTier: "BASIC",
      fromStatus: "ACTIVE",
      toStatus: "ACTIVE",
      stripeEventId: `38d65fc2-7fef-4917-8aae-b47a04d770c${index}`,
      metadata: {},
   };
};

export const dUserCreate = (index = 1): DUserCreate => {
   return {
      name: `User ${index}`,
      email: "test@email.com",
      hashedPassword: "hashedPassword-1",
   };
};

export const dUserUpdate = (index = 1): DUserUpdate => {
   return {
      name: `User ${index}`,
   };
};

export const dLibraryEntryWithPromptTemplate = (
   index = 1
): DLibraryEntryWithPromptTemplate => {
   const entry = dLibraryEntry(index);
   const templateDescriptor = dPromptTemplateDescriptorWithPrompt(index);
   return {
      ...entry,
      templateDescriptor,
   };
};

export const dLibraryEntries = (count = 3): DLibraryEntry[] => {
   return range(0, count).map((i) => dLibraryEntry(i));
};

export const dLibraryEntry = (index = 1): DLibraryEntry => {
   const templateDescriptor = dPromptTemplateDescriptor(index);
   return {
      id: `457bf695-6f74-44aa-9b3a-e179ea9e817${index}`,
      userId: `037c87e0-9bbe-4529-9fea-f8ae91c65d9${index}`,
      templateDescriptorId: `52e59bcf-7651-45f8-91bf-63b8a4e06d8${index}`,
      templateDescriptor,
      createdAt: new Date("2025-09-27").toISOString(),
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

export const dOrderCreate = (itemsCount = 3): DOrderCreate => {
   return {
      totalAmount: itemsCount * 19.99,
      items: dOrderItemsCreate(itemsCount),
   };
};

export const dOrderUpdate = (index = 1): DOrderUpdate => {
   return {
      status: "COMPLETED",
      stripeCheckoutSessionId: `907edda7-f0dd-4e79-bfe9-52745466586${index}`,
      stripePaymentIntentId: `31119165-f7d2-4113-b664-dc084637707${index}`,
      stripePaymentStatus: "paid",
      paymentMethod: "card",
   };
};

export const dOrderItemsCreate = (count = 3): DOrderItemCreate[] => {
   return range(0, count).map((i) => dOrderItemCreate(i));
};

export const dOrderItemCreate = (index = 1): DOrderItemCreate => {
   return {
      productId: `334db648-f300-4284-8149-075ff465d75${index}`,
      productName: `name ${index}`,
      productDescription: `description ${index}`,
      productType: "TEMPLATE",
      quantity: 1,
      price: 19.99,
   };
};

export const dOrders = (count = 3): DOrder[] => {
   return range(0, count).map((i) => dOrder(i));
};

export const dOrder = (index = 1, itemsCount = 3): DOrder => {
   return {
      id: `10fbd76c-4fd4-4294-a541-5d96e6a8e84${index}`,
      userId: "user-1",
      status: "COMPLETED",
      totalAmount: itemsCount * 19.99,
      paymentMethod: "card",
      stripeCheckoutSessionId: `dc03d2ff-3019-4bca-ac05-84cd57c7c47${index}`,
      stripePaymentIntentId: `c9aee31d-8b34-4ed7-adf4-594c74d4104${index}`,
      stripePaymentStatus: "PAID",
      items: dOrderItems(itemsCount),
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dOrderItems = (count = 3): DOrderItem[] => {
   return range(0, count).map((i) => dOrderItem(i));
};

export const dOrderItem = (index = 1): DOrderItem => {
   return {
      id: `d94196ec-d343-47b5-bf8d-43d5327f9c4${index}`,
      orderId: `6510c275-019c-42e1-8691-209734b8e95${index}`,
      productId: `334db648-f300-4284-8149-075ff465d75${index}`,
      productName: `name ${index}`,
      productDescription: `description ${index}`,
      productType: "BUNDLE",
      price: 19.99,
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dProducts = (count = 3): DProduct[] => {
   return range(0, count).map((i) => dProduct(i));
};

export const dProduct = (index = 1): DProduct => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      name: `name ${index}`,
      description: `description ${index}`,
      price: 59.99,
      discountAmount: 14.98,
      type: "BUNDLE",
      status: "ACTIVE",
      features: dFeatures(),
      useCases: dUseCases(),
      examples: dExamples(),
      instructions: dInstructions(),
      productItems: dProductItems(),
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dProductItems = (count = 3): DProductItem[] => {
   return range(0, count).map((i) => dProductItem(i));
};

export const dProductItem = (index = 1): DProductItem => {
   const template = dPromptTemplateDescriptor(index);
   return {
      id: `418c5cf3-d0d5-4ad8-a841-d458c8aa6cb1${index}`,
      productId: `2cabc8ff-010a-4b0b-93c6-4f311d35c432${index}`,
      templateId: template.id,
      template,
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dFeatures = (count = 3): DFeature[] => {
   return range(0, count).map((i) => dFeature(i));
};

export const dFeature = (index = 1): DFeature => {
   return {
      icon: `Check`,
      title: `title ${index}`,
      description: `description ${index}`,
   };
};

export const dUseCases = (count = 3): DUseCase[] => {
   return range(0, count).map((i) => dUseCase(i));
};

export const dUseCase = (index = 1): DUseCase => {
   return {
      category: `category 1`,
      description: `description ${index}`,
      tags: ["tag 1", "tag 2", "tag 3"],
   };
};

export const dExamples = (count = 3): DExample[] => {
   return range(0, count).map((i) => dExample(i));
};

export const dExample = (index = 1): DExample => {
   return {
      title: `title ${index}`,
      content: `content ${index}`,
   };
};

export const dInstructions = (count = 3): DInstruction[] => {
   return range(0, count).map((i) => dInstruction(i));
};

export const dInstruction = (index = 1): DInstruction => {
   return {
      title: `title ${index}`,
      description: `description ${index}`,
      step: index,
   };
};

export const dPromptTemplateDescriptorWithPrompt = (
   index = 1
): DPromptTemplateDescriptorWithTemplate => {
   const descriptor = dPromptTemplateDescriptor(index);
   const promptTemplate = dPromptTemplate(index);
   return {
      ...descriptor,
      promptTemplate,
   };
};

export const dPromptTemplateDescriptors = (
   count = 3
): DPromptTemplateDescriptor[] => {
   return range(0, count).map((i) => dPromptTemplateDescriptor(i));
};

export const dPromptTemplateDescriptor = (
   index = 1
): DPromptTemplateDescriptor => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      description: `description ${index}`,
      categories: dPromptTemplateCategories(),
      recommendedModel: `model ${index}`,
      promptTemplateId: `a8367fc3-b556-4838-b3af-f971af96b40${index}`,
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptTemplate = (index = 1): DPromptTemplate => {
   return {
      id: `7c1c8898-199c-4274-8139-a883efdc676${index}`,
      content: `content ${index}`,
      detailedDescription: `detailedDescription ${index}`,
      fields: dPromptTemplateFields(3),
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptTemplateUpdate = (index = 1): DPromptTemplateUpdate => {
   return {
      title: `title ${index}`,
      description: `updated description ${index}`,
      detailedDescription: `updated detailedDescription ${index}`,
      content: `updated content ${index}`,
      categories: ["category 1"],
      recommendedModel: `model ${index}`,
      fields: dPromptTemplateFieldUpdates(),
   };
};

export const dPromptTemplateFields = (count = 3): DPromptTemplateField[] => {
   return range(0, count).map((i) => dPromptTemplateField(i));
};

export const dPromptTemplateField = (index = 1): DPromptTemplateField => {
   return {
      id: `7e736436-8c94-4ec9-bd21-1db1b52d357${index}`,
      promptTemplateId: `8b82ebb2-5966-4788-8fed-3ad18c08e28${index}`,
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

export const dPromptTemplateFieldUpdates = (
   count = 3
): DPromptTemplateFieldUpdate[] => {
   return range(0, count).map((i) => dPromptTemplateFieldUpdate(i));
};

export const dPromptTemplateFieldUpdate = (
   index = 1
): DPromptTemplateFieldUpdate => {
   return {
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

export const dPromptDescriptorsPage = (): DPromptDescriptorsPage => {
   const prompts = dPromptDescriptors();
   return {
      content: prompts,
      numberOfElements: prompts.length,
      pageNumber: 1,
      pageSize: 3,
      totalElements: 15,
      totalPages: 5,
   };
};

export const dPromptDescriptors = (count = 3): DPromptDescriptor[] => {
   return range(0, count).map((i) => dPromptDescriptor(i));
};

export const dPromptDescriptor = (index = 1): DPromptDescriptor => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      currentVersion: 1,
      content: "content 1",
      categories: dPromptCategories(),
      recommendedModel: `model ${index}`,
      isFavorite: true,
      followUpPrompts: dPromptFollowUps(),
      versions: dPromptVersions(),
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptUpdate = (index = 1): DPromptUpdate => {
   return {
      title: `title ${index}`,
      content: `updated content ${index}`,
      categories: ["category 1"],
      recommendedModel: `model ${index}`,
      followUpPrompts: dFollowUpPrompts(),
   };
};

export const dFollowUpPrompts = (count = 3): string[] => {
   return range(0, count).map((i) => `prompt follow up ${i}`);
};

export const dPromptCategories = (count = 3): DPromptCategory[] => {
   return range(0, count).map((i) => dPromptTemplateCategory(i));
};

export const dPromptCategory = (index = 1): DPromptCategory => {
   return {
      name: `category ${index}`,
   };
};

export const dPromptFollowUps = (count = 3): DPromptFollowUp[] => {
   return range(0, count).map((i) => dPromptFollowUp(i));
};

export const dPromptFollowUp = (index = 1): DPromptFollowUp => {
   return {
      id: `f23c15c7-7d2d-40a2-a895-6a78516b9b3${index}`,
      content: `content ${index}`,
      order: index,
   };
};

export const dPromptVersions = (count = 3): DPromptVersion[] => {
   return range(0, count).map((i) => dPromptVersion(i));
};

export const dPromptVersion = (index = 1): DPromptVersion => {
   return {
      id: `db4079a0-c783-4d41-9bb3-0a1c45edeb7${index}`,
      version: index,
      content: `content ${index}`,
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptsPageQuery = (): DPromptDescriptorsPageQuery => {
   return {
      pagination: {
         pageNumber: 15,
         pageSize: 5,
      },
      filter: dPromptsFilter(),
      globalFilter: "test 1",
   };
};

export const dPromptsFilter = (): DPromptDescriptorsFilter => {
   return {
      search: "search-1",
      categories: ["cat 1", "cat 2", "cat 3"],
      isFavorite: false,
   };
};

export const sort = (field = "field1", desc = false): Sort => {
   return { field, desc };
};
