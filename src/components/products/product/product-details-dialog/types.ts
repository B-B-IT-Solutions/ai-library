import { DProductItem } from "@/data/types/domain/product";

export interface BundleItemGroup {
   category: string;
   items: DProductItem[];
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
