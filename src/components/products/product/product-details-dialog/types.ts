import { DBundleItem } from "@/data/types/domain/product";
import type {
   Example,
   Feature,
   Instruction,
   UseCase,
} from "@/data/types/domain/product-metadata";

export interface ParsedProductContent {
   features: Feature[];
   useCases: UseCase[];
   examples: Example[];
   instructions: Instruction[];
   placeholders: Placeholder[];
}

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
