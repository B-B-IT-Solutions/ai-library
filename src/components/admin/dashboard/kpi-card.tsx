import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";

type Props = {
   title: string;
   value: string | number;
   subtitle?: string;
   icon: LucideIcon;
};

export const KpiCard = ({ title, value, subtitle, icon: Icon }: Props) => {
   return (
      <Card data-testid="kpi-card">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
         </CardHeader>
         <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
         </CardContent>
      </Card>
   );
};
