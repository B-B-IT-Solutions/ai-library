import { ProductType } from "@/generated/prisma/enums";

const colors = {
   TEMPLATE: "bg-blue-100 text-blue-700 border-blue-200",
   BUNDLE: "bg-green-100 text-green-700 border-green-200",
};

export const getTypeBadgeColor = (type: ProductType) => {
   return colors[type];
};
