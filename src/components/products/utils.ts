import { flatMap, isEqual, uniqWith } from "es-toolkit/compat";

import { DProductItem } from "@/data/types/domain/product";
import { ProductType } from "@/generated/prisma/enums";

const colors = {
   TEMPLATE: "bg-blue-100 text-blue-700 border-blue-200",
   BUNDLE: "bg-green-100 text-green-700 border-green-200",
};

export const getTypeBadgeColor = (type: ProductType) => {
   return colors[type];
};

export const resolveUniqCategories = (items: DProductItem[]) => {
   const allCategories = flatMap(
      items,
      (item) => item.template?.categories || []
   );
   return uniqWith(allCategories, (c1, c2) => isEqual(c1.name, c2.name));
};
