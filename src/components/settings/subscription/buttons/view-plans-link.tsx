import { FC } from "react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const ViewPlansLink: FC = () => {
   return (
      <Button asChild={true} data-testid="view-plans-link">
         <Link href="/subscription/pricing">View Plans</Link>
      </Button>
   );
};
