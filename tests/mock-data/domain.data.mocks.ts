import { addDays } from "date-fns";
import { range } from "es-toolkit";
import { map } from "es-toolkit/compat";
import { Check } from "lucide-react";

import { VariableStatus } from "@/components/prompts/detail/edit/form/utils/variables";
import { Sort, SortOrder } from "@/data/types/common";
import { DCart, DCartItem } from "@/data/types/domain/cart";
import {
   DCatalogEntriesFilter,
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
   DCatalogEntry,
   DCatalogEntryCategory,
   DCatalogEntryField,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import {
   DCollection,
   DCollectionEntry,
   DCollectionPreview,
   DCollectionsFilter,
   DCollectionsPage,
   DCollectionsPageQuery,
   DCollectionUpdate,
} from "@/data/types/domain/collection";
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
   DPrompt,
   DPromptCategory,
   DPromptGenerationData,
   DPromptPreview,
   DPromptPreviewsPage,
   DPromptPreviewsPageQuery,
   DPromptsFilter,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptsUsage,
   DPromptUpdate,
   DPromptUpdateCrate,
   DPromptVariable,
   DPromptVariableUpdate,
   DPromptVariableValues,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import {
   DPrompt0,
   DPrompt0Category,
   DPrompt0FollowUp,
   DPrompt0FollowUpUpdate,
   DPrompt0sFilter,
   DPrompt0sPage,
   DPrompt0sPageQuery,
   DPrompt0Update,
   DPrompt0Version,
} from "@/data/types/domain/prompt0";
import {
   DGlobalPromptField,
   DGlobalPromptFieldUpdate,
} from "@/data/types/domain/settings";
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
   DTrialStatus,
} from "@/data/types/domain/subscription";
import {
   DResetPasswordToken,
   DUser,
   DUserCreate,
   DUserInternal,
   DUserUpdate,
   DVerificationToken,
} from "@/data/types/domain/user";
import {
   DWorkflow,
   DWorkflowsFilter,
   DWorkflowsPage,
   DWorkflowsPageQuery,
   DWorkflowStep,
   DWorkflowStepUpdate,
   DWorkflowStepWithOutgoingEdges,
   DWorkflowsUsage,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
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
      emailVerified: new Date("2025-09-27"),
      trialEndsAt: addDays(new Date("2025-09-27"), 14),
   };
};

export const dTrialStatus = (isActive = true, daysLeft = 5): DTrialStatus => {
   return {
      isActive,
      daysLeft,
      endsAt: addDays(new Date(), daysLeft),
   };
};

export const dVerificationToken = (index = 1): DVerificationToken => {
   return {
      identifier: `user${index}@email.com`,
      token: `token-${index}`,
      expires: new Date("2035-09-27"),
   };
};

export const dResetPasswordToken = (index = 1): DResetPasswordToken => {
   return {
      identifier: `user${index}@email.com`,
      token: `token-${index}`,
      expires: new Date("2035-09-27"),
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
         maxPrompts: 50,
         maxCollections: 20,
         maxPromptVariables: -1,
         maxGlobalPromptVariables: 5,
         canAccessPromptTemplatingEditor: true,
         canAccessDirectOpenInAiTool: true,
         canExportPrompts: true,
         canShareCollections: false,
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
      legalNoticesAcceptedAt: new Date("2025-09-27"),
      trialEndsAt: new Date("2025-10-11"),
   };
};

export const dUserUpdate = (index = 1): DUserUpdate => {
   return {
      name: `User ${index}`,
   };
};

export const dTemplateCategories = (count = 3): string[] => {
   return range(0, count).map((i) => `cat-${i + 1}`);
};

export const dTemplateModels = (count = 3): string[] => {
   return range(0, count).map((i) => `mod-${i + 1}`);
};

export const dCollectionIds = (count = 3): string[] => {
   const collections = dCollections(count);
   return map(collections, (c) => c.id);
};

export const dCollections = (count = 3): DCollection[] => {
   return range(0, count).map((i) => dCollection(i));
};

export const dCollectionsPageQuery = (index = 1): DCollectionsPageQuery => {
   return {
      pagination: {
         pageSize: 10,
         pageNumber: 1,
      },
      filter: dCollectionsFilter(index),
      sort: {
         field: "name",
         order: "asc",
      },
   };
};

export const dCollectionsFilter = (index = 1): DCollectionsFilter => {
   return {
      search: `search ${index}`,
   };
};

export const dCollectionsPage = (count = 3): DCollectionsPage => {
   const collections = dCollections(count);
   return {
      content: collections,
      numberOfElements: collections.length,
      pageNumber: 1,
      pageSize: 3,
      totalElements: 15,
      totalPages: 5,
   };
};

export const dCollection = (index = 1): DCollection => {
   return {
      id: `457bf695-6f74-44aa-9b3a-e179ea9e817${index}`,
      userId: `037c87e0-9bbe-4529-9fea-f8ae91c65d9${index}`,
      name: `name ${index}`,
      description: `description ${index}`,
      color: `color ${index}`,
      order: index,
      isPublic: index % 2 == 0,
      publicToken: `token-${index}`,
      templateCount: index * 10,
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dCollectionPreviews = (count = 3): DCollectionPreview[] => {
   return range(0, count).map((i) => dCollection(i));
};

export const dCollectionPreview = (index = 1): DCollectionPreview => {
   return {
      id: `457bf695-6f74-44aa-9b3a-e179ea9e817${index}`,
      name: `name ${index}`,
      color: `color ${index}`,
   };
};

export const dCollectionUpdate = (index = 1): DCollectionUpdate => {
   return {
      name: `name ${index}`,
      description: `description ${index}`,
      color: `color ${index}`,
      order: index,
   };
};

export const dCollectionPromptIds = (count = 3): string[] => {
   const collections = dCollectionEntries(count);
   return map(collections, (c) => c.promptId);
};

export const dCollectionEntries = (count = 3): DCollectionEntry[] => {
   return range(0, count).map((i) => dCollectionEntry(i));
};

export const dCollectionEntry = (index = 1): DCollectionEntry => {
   return {
      collectionId: `457bf695-6f74-44aa-9b3a-e179ea9e817${index}`,
      promptId: `334db648-f300-4284-8149-075ff465d75${index}`,
      addedAt: new Date("2025-09-27").toISOString(),
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
   const template = dPrompt(index);
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
      icon: Check,
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

export const dPromptsUsage = (index = 1): DPromptsUsage => {
   return {
      current: 5 + index,
      limit: 50 + index,
   };
};

export const dPromptGenerationData = (index = 1): DPromptGenerationData => {
   return {
      template: dPromptWithContent(index),
      allFields: dPromptVariables(),
   };
};

export const dPromptPreviewsPageQuery = (
   index = 1
): DPromptPreviewsPageQuery => {
   return {
      pagination: {
         pageSize: 10,
         pageNumber: 1,
      },
      filter: dPromptsFilter(index),
   };
};

export const dPromptsPageQuery = (index = 1): DPromptsPageQuery => {
   return {
      pagination: {
         pageSize: 10,
         pageNumber: 1,
      },
      filter: dPromptsFilter(index),
   };
};

export const dPromptsFilter = (index = 1): DPromptsFilter => {
   return {
      search: `search ${index}`,
      categories: ["cat 1", "cat 2", "cat 3"],
      models: ["mod 1", "mod 2", "mod 3"],
      collectionIds: ["col-id-1", "col-id-2", "col-id-3"],
      isFavorite: false,
   };
};

export const dPromptsPage = (count = 3): DPromptsPage => {
   const prompts = dPrompts(count);
   return {
      content: prompts,
      numberOfElements: prompts.length,
      pageNumber: 1,
      pageSize: 3,
      totalElements: 15,
      totalPages: 5,
   };
};

export const dPromptPreviewsPage = (count = 3): DPromptPreviewsPage => {
   const prompts = dPromptPreviews(count);
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
      description: `description ${index}`,
      categories: dPromptCategories(),
      fields: dPromptVariables(),
      globalFieldIds: dGlobalPromptFieldIds(),
      recommendedModel: `model ${index}`,
      isFavorite: index % 2 == 0,
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptWithContent = (index = 1): DPromptWithContent => {
   return {
      ...dPrompt(index),
      content: `content ${index}`,
   };
};

export const dPromptPreviews = (count = 3): DPromptPreview[] => {
   return range(0, count).map((i) => dPromptPreview(i));
};

export const dPromptPreview = (index = 1): DPromptPreview => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
   };
};

export const dPromptUpdateCrate = (index = 1): DPromptUpdateCrate => {
   return {
      data: dPromptUpdate(index),
      collectionId: `457bf695-6f74-44aa-9b3a-e179ea9e817${index}`,
   };
};

export const dPromptUpdate = (index = 1): DPromptUpdate => {
   return {
      title: `title ${index}`,
      description: `updated description ${index}`,
      content: `updated content ${index}`,
      categories: ["category 1"],
      recommendedModel: `model ${index}`,
      fields: dPromptVariableUpdates(),
      globalFieldIds: dGlobalPromptFieldIds(),
   };
};

export const dPromptVariables = (count = 3): DPromptVariable[] => {
   return range(0, count).map((i) => dPromptVariable(i));
};

export const dPromptVariable = (index = 1): DPromptVariable => {
   return {
      id: `7e736436-8c94-4ec9-bd21-1db1b52d357${index}`,
      promptId: `8b82ebb2-5966-4788-8fed-3ad18c08e28${index}`,
      name: `field_${index}`,
      label: `label ${index}`,
      description: `description ${index}`,
      type: "SELECT",
      required: true,
      order: index,
      options: ["option 1", "option 2", "option 3"],
      defaultValue: "option 1",
   };
};

export const dPromptVariableUpdates = (count = 3): DPromptVariableUpdate[] => {
   return range(0, count).map((i) => dPromptVariableUpdate(i));
};

export const dPromptVariableUpdate = (index = 1): DPromptVariableUpdate => {
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

export const dPromptVariableValues = (index = 1): DPromptVariableValues => {
   return {
      field_1: `value 1 - ${index}`,
      field_2: `value 2 - ${index}`,
      field_3: `value 3 - ${index}`,
   };
};

export const dVariableStatus = (index = 1): VariableStatus => {
   return {
      undefined: [
         `vara - ${index}`,
         `vara - ${index + 1}`,
         `vara - ${index + 2}`,
      ],
      used: [`varb - ${index}`, `varb - ${index + 1}`, `varb - ${index + 2}`],
      unused: [`varc - ${index}`, `varc - ${index + 1}`, `varc - ${index + 2}`],
   };
};

export const dPromptCategoriesString = (count = 3): string[] => {
   return map(dPromptCategories(count), (c) => c.name);
};

export const dPromptCategories = (count = 3): DPromptCategory[] => {
   return range(0, count).map((i) => dPromptCategory(i));
};

export const dPromptCategory = (index = 1): DPromptCategory => {
   return {
      name: `category ${index}`,
   };
};

export const dPrompt0sPage = (): DPrompt0sPage => {
   const prompts = dPrompt0s();
   return {
      content: prompts,
      numberOfElements: prompts.length,
      pageNumber: 1,
      pageSize: 3,
      totalElements: 15,
      totalPages: 5,
   };
};

export const dPrompt0s = (count = 3): DPrompt0[] => {
   return range(0, count).map((i) => dPrompt0(i));
};

export const dPrompt0 = (index = 1): DPrompt0 => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      currentVersion: 1,
      content: "content 1",
      categories: dPrompt0Categories(),
      recommendedModel: `model ${index}`,
      isFavorite: true,
      followUpPrompts: dPromptFollowUps(),
      versions: dPrompt0Versions(),
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dCatalogEntriesPage = (count = 3): DCatalogEntriesPage => {
   const content = dCatalogEntries(count);
   return {
      content,
      pageNumber: 0,
      pageSize: 12,
      numberOfElements: content.length,
      totalPages: 1,
      totalElements: content.length,
   };
};

export const dCatalogEntriesPageQuery = (
   index = 1
): DCatalogEntriesPageQuery => {
   return {
      pagination: {
         pageSize: 10,
         pageNumber: 1,
      },
      filter: dCatalogEntriesFilter(index),
   };
};

export const dCatalogEntriesFilter = (index = 1): DCatalogEntriesFilter => {
   return {
      search: `search ${index}`,
      categories: [`cat-${index}`],
   };
};

export const dCatalogEntriesWithContent = (
   count = 3
): DCatalogEntryWithContent[] => {
   return range(0, count).map((i) => dCatalogEntryWithContent(i + 1));
};

export const dCatalogEntryWithContent = (
   index = 1
): DCatalogEntryWithContent => {
   return {
      ...dCatalogEntry(index),
      content: `Template content with {{field_${index}}} placeholder`,
   };
};

export const dCatalogEntries = (count = 3): DCatalogEntry[] => {
   return range(0, count).map((i) => dCatalogEntry(i + 1));
};

export const dCatalogEntry = (index = 1): DCatalogEntry => ({
   id: `entry-uuid-000${index}`,
   slug: `entry-slug-${index}`,
   title: `Catalog Entry ${index}`,
   description: `Description for catalog entry ${index}`,
   recommendedModel: "GPT-4o",
   status: "PUBLISHED",
   category: dCatalogEntryCategory(index),
   fields: dCatalogEntryFields(3),
   copyCount: index * 5,
   publishedAt: new Date("2025-09-27").toISOString(),
   createdAt: new Date("2025-09-27").toISOString(),
   updatedAt: new Date("2025-09-27").toISOString(),
});

export const dCatalogEntryCategories = (count = 3): DCatalogEntryCategory[] => {
   return range(0, count).map((i) => dCatalogEntryCategory(i + 1));
};

export const dCatalogEntryCategory = (index = 1): DCatalogEntryCategory => ({
   id: `cat-uuid-000${index}`,
   name: `Category ${index}`,
   slug: `category-${index}`,
   description: `Description for category ${index}`,
   order: index,
});

export const dCatalogEntryFields = (count = 3): DCatalogEntryField[] => {
   return range(0, count).map((i) => dCatalogEntryField(i + 1));
};

export const dCatalogEntryField = (index = 1): DCatalogEntryField => ({
   id: `field-uuid-000${index}`,
   catalogEntryId: `entry-uuid-0001`,
   name: `field_${index}`,
   label: `Field Label ${index}`,
   description: `Field description ${index}`,
   type: "TEXT",
   required: true,
   order: index,
   defaultValue: null,
   options: ["option-1", "option-2", "option-3"],
});

export const dPrompt0Update = (index = 1): DPrompt0Update => {
   return {
      title: `title ${index}`,
      content: `updated content ${index}`,
      categories: ["category 1"],
      recommendedModel: `model ${index}`,
      followUpPrompts: dPrompt0FollowUpUpdates(),
   };
};

export const dPrompt0FollowUpUpdates = (
   count = 3
): DPrompt0FollowUpUpdate[] => {
   return range(0, count).map((i) => dPrompt0FollowUpUpdate(i));
};

export const dPrompt0FollowUpUpdate = (index = 1): DPrompt0FollowUpUpdate => {
   return {
      content: `prompt follow up update ${index}`,
      order: index,
   };
};

export const dPrompt0FollowUps = (count = 3): DPrompt0FollowUp[] => {
   return range(0, count).map((i) => dPrompt0FollowUp(i));
};

export const dPrompt0FollowUp = (index = 1): DPrompt0FollowUp => {
   return {
      id: `f23c15c7-7d2d-40a2-a895-6a78516b9b3${index}`,
      content: `prompt follow up ${index}`,
      order: index,
   };
};

export const dPrompt0CategoriesString = (count = 3): string[] => {
   return map(dPrompt0Categories(count), (c) => c.name);
};

export const dPrompt0Categories = (count = 3): DPrompt0Category[] => {
   return range(0, count).map((i) => dPromptCategory(i));
};

export const dPrompt0Category = (index = 1): DPrompt0Category => {
   return {
      name: `category ${index}`,
   };
};

export const dPromptFollowUps = (count = 3): DPrompt0FollowUp[] => {
   return range(0, count).map((i) => dPromptFollowUp(i));
};

export const dPromptFollowUp = (index = 1): DPrompt0FollowUp => {
   return {
      id: `f23c15c7-7d2d-40a2-a895-6a78516b9b3${index}`,
      content: `content ${index}`,
      order: index,
   };
};

export const dPrompt0Versions = (count = 3): DPrompt0Version[] => {
   return range(0, count).map((i) => dPrompt0Version(i));
};

export const dPrompt0Version = (index = 1): DPrompt0Version => {
   return {
      id: `db4079a0-c783-4d41-9bb3-0a1c45edeb7${index}`,
      version: index,
      content: `content ${index}`,
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPrompt0sPageQuery = (): DPrompt0sPageQuery => {
   return {
      pagination: {
         pageNumber: 15,
         pageSize: 5,
      },
      filter: dPrompt0sFilter(),
      globalFilter: "test 1",
   };
};

export const dPrompt0sFilter = (): DPrompt0sFilter => {
   return {
      search: "search-1",
      categories: ["cat 1", "cat 2", "cat 3"],
      isFavorite: false,
   };
};

export const sort = (field = "field1", order: SortOrder = "desc"): Sort => {
   return { field, order };
};

export const dGlobalPromptFieldIds = (count = 1): string[] => {
   const fields = dGlobalPromptFields(count);
   return map(fields, "id");
};

export const dGlobalPromptFields = (count = 3): DGlobalPromptField[] => {
   return range(0, count).map((i) => dGlobalPromptField(i));
};

export const dGlobalPromptField = (index = 1): DGlobalPromptField => {
   return {
      id: `global-field-id-${index}`,
      userId: `334db648-f300-4284-8149-075ff465d75${index}`,
      name: `name_${index}`,
      label: `label ${index}`,
      description: `description ${index}`,
      type: "TEXT",
      required: true,
      defaultValue: `defaultValue-${index}`,
      options: [`option ${index}`, `option ${index + 1}`],
      order: index,
      createdAt: new Date("2025-09-27").toISOString(),
      updatedAt: new Date("2025-09-27").toISOString(),
   };
};

export const dGlobalPromptFieldUpdate = (
   index = 1
): DGlobalPromptFieldUpdate => {
   return {
      name: `name-${index}`,
      label: `label ${index}`,
      description: `description ${index}`,
      type: "NUMBER",
      required: true,
      defaultValue: `defaultValue-${index}`,
      options: [`option ${index}`, `option ${index + 1}`],
      order: index,
   };
};

export const dWorkflowUpdate = (index = 1): DWorkflowUpdate => {
   return {
      title: `title-${index}`,
      description: `description ${index}`,
      steps: dWorkflowStepUpdates(3),
   };
};

export const dWorkflowsUsage = (index = 1): DWorkflowsUsage => {
   return {
      current: index,
      limit: index + 3,
   };
};

export const dWorkflowStepUpdates = (count = 3): DWorkflowStepUpdate[] => {
   return range(0, count).map((i) => dWorkflowStepUpdate(i));
};

export const dWorkflowStepUpdate = (index = 0): DWorkflowStepUpdate => {
   return {
      id: `step-id-${index}`,
      title: `step-title-${index}`,
      hint: `step-hint-${index}`,
      type: "STANDALONE",
      promptId: null,
      edgeId: `d410c9b7-8ef8-4ffc-8617-00851166313${index}`,
      content: `content-${index}`,
      isStart: index === 0,
      position: index + 1,
      edges: [
         {
            toStepId: `d410c9b7-8ef8-4ffc-8617-00851166313${index + 1}`,
            label: "Weiter",
            order: 0,
         },
         {
            toStepId: `d410c9b7-8ef8-4ffc-8617-00851166313${index + 2}`,
            label: "Abbrechen",
            order: 1,
         },
      ],
   };
};

export const dWorkflowsPageQuery = (index = 1): DWorkflowsPageQuery => {
   return {
      pagination: {
         pageNumber: 1,
         pageSize: 10,
      },
      filter: dWorkflowsFilter(index),
   };
};

export const dWorkflowsFilter = (index = 1): DWorkflowsFilter => {
   return {
      search: `search-${index}`,
   };
};

export const dWorkflowsPage = (count = 3): DWorkflowsPage => {
   const content = dWorkflows(count);
   return {
      content,
      numberOfElements: content.length,
      pageNumber: 0,
      pageSize: 10,
      totalElements: count,
      totalPages: 1,
   };
};

export const dWorkflows = (count = 3): DWorkflow[] => {
   return range(0, count).map((i) => dWorkflow(i + 1));
};

export const dWorkflowWithSteps = (index = 1): DWorkflowWithSteps => {
   return {
      ...dWorkflow(index),
      steps: dWorkflowSteps(),
   };
};

export const dWorkflow = (index = 1): DWorkflow => {
   return {
      id: `workflow-id-000${index}`,
      title: `title-${index}`,
      description: `description ${index}`,
      stepCount: index + 2,
      createdAt: new Date("2025-09-27").toISOString(),
      updatedAt: new Date("2025-09-27").toISOString(),
   };
};

export const dWorkflowSteps = (count = 3): DWorkflowStep[] => {
   return range(0, count).map((i) => dWorkflowStep(i));
};

export const dWorkflowStep = (index = 0): DWorkflowStep => {
   return {
      id: `3e91cc43-0245-4c83-84d8-8de9582183d${index}`,
      workflowId: `workflow-id-0001`,
      title: `step-title-${index}`,
      hint: `step-hint-${index}`,
      promptTitle: `prompt-${index}`,
      type: "STANDALONE",
      promptId: null,
      edgeId: `d410c9b7-8ef8-4ffc-8617-00851166313${index}`,
      content: `content-${index}`,
      isStart: index === 0,
      position: index + 1,
      outgoingEdges: [
         {
            id: "oe-1",
            fromStepId: `3e91cc43-0245-4c83-84d8-8de9582183d${index}`,
            toStepId: `d410c9b7-8ef8-4ffc-8617-00851166313${index + 1}`,
            label: "Weiter",
            order: 0,
         },
         {
            id: "oe-2",
            fromStepId: `3e91cc43-0245-4c83-84d8-8de9582183d${index}`,
            toStepId: `d410c9b7-8ef8-4ffc-8617-00851166313${index + 1}`,
            label: "Abbrechen",
            order: 1,
         },
      ],
   };
};

export const dWorkflowStepsWithOutgoingEdges = (
   count = 3
): DWorkflowStepWithOutgoingEdges[] => {
   return range(0, count).map((i) => dWorkflowStepWithOutgoingEdges(i + 1));
};

export const dWorkflowStepWithOutgoingEdges = (
   index = 1
): DWorkflowStepWithOutgoingEdges => {
   return {
      id: `step-id-000${index}`,
      edgeId: `edge-id-000${index}`,
      outgoingEdges: [
         {
            toStepId: `step-${index}-1`,
         },
         {
            toStepId: `step-${index}-2`,
         },
         {
            toStepId: `step-${index}-3`,
         },
      ],
   };
};
