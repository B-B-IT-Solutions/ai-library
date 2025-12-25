export interface ParsedProductContent {
   features: Feature[];
   useCases: UseCase[];
   examples: Example[];
   instructions: Instruction[];
   placeholders: Placeholder[];
}

export interface Feature {
   icon: string; // lucide-react icon name
   title: string;
   description: string;
}

export interface UseCase {
   category: string;
   description: string;
   tags: string[];
}

export interface Example {
   title: string;
   content: string;
}

export interface Instruction {
   step: number;
   title: string;
   description: string;
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
   items: import("@/data/types/domain/product").DBundleItem[];
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
