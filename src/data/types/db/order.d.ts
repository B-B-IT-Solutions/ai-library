import {
   ProductWithTemplateBundleItems,
   PromptTemplateWithCategories,
} from "@/data/types/db/product";
import { Order, OrderItem, Product, Purchase } from "@/generated/prisma/client";

export type OrderProduct = Product & {
   template: PromptTemplateWithCategories | null;
   bundleItems: PromptTemplateWithCategories[];
};

export type OrderPurchase = Purchase & {
   template: PromptTemplateWithCategories;
};

export type OrderItemWithProduct = OrderItem & {
   product: ProductWithTemplateBundleItems;
};

export type OrderWithItemsAndPurchases = Order & {
   items: OrderItemWithProduct[];
   purchases: OrderPurchase[];
};
