import { DBundleItem } from "@/data/types/domain/product";

export interface Placeholder {
   name: string;
   position: number;
}

export interface BundleValue {
   totalIndividualPrice: number;
   bundlePrice: number;
   savings: number;
   savingsPercentage: number;
   itemCount: number;
}

export interface BundleItemGroup {
   category: string;
   items: DBundleItem[];
}

export interface FormattedLine {
   lineNumber: number;
   content: string;
   type: "heading" | "list" | "placeholder" | "code" | "text";
   className: string;
}

export interface ContentSection {
   title: string;
   lines: FormattedLine[];
   collapsible: boolean;
   collapsed: boolean;
}
