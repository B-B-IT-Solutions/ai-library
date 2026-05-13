import { Page } from "@/data/types/common";
import {
   Prompt0,
   Prompt0Category,
   Prompt0FollowUp,
   Prompt0Version,
} from "@/generated/prisma/client";

export type Prompt0WithRelations = Prompt0 & {
   categories: Prompt0Category[];
   versions: Prompt0Version[];
   followUpPrompts: Prompt0FollowUp[];
};

export type Prompt0sPage = Page<Prompt0WithRelations>;
