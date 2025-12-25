/**
 * Product metadata type definitions
 * These types represent structured data stored in the Product model
 */

export type Feature = {
   icon: string; // lucide-react icon name
   title: string;
   description: string;
};

export type UseCase = {
   category: string;
   description: string;
   tags: string[];
};

export type Example = {
   title: string;
   content: string;
};

export type Instruction = {
   step: number;
   title: string;
   description: string;
};
