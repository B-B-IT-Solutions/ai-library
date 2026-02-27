import { map } from "es-toolkit/compat";
import Link from "next/link";

import { DSettingsSection } from "@/data/types/domain/settings";
import { cn, toTestId } from "@/lib/utils";

type NavigationItem = {
   section: DSettingsSection;
   label: string;
};

type NavigationGroup = {
   id: string;
   label: string;
   items: NavigationItem[];
};

const groups: NavigationGroup[] = [
   {
      id: "user",
      label: "Konto",
      items: [
         { section: "general", label: "Allgemein" },
         { section: "account", label: "Konto" },
         { section: "subscription", label: "Abrechnung" },
      ],
   },
   {
      id: "content",
      label: "Inhalt",
      items: [
         {
            section: "global-template-fields",
            label: "Vorlagen-Felder",
         },
      ],
   },
];

type Props = {
   active: DSettingsSection;
};

export const Navigation = ({ active }: Props) => {
   const navItem = (entry: NavigationItem) => {
      const isActive = active === entry.section;
      const styles = isActive
         ? "bg-primary text-primary-foreground shadow-sm"
         : "hover:bg-accent hover:text-accent-foreground";
      return (
         <Link
            href={entry.section}
            key={entry.section}
            className={cn(
               "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
               styles
            )}
            data-testid={`${entry.section}-link`}
         >
            <span className="font-medium">{entry.label}</span>
         </Link>
      );
   };

   const navGroup = (group: NavigationGroup, index: number) => {
      const styles = index > 0 ? "mt-4" : undefined;
      return (
         <div
            key={index}
            className={styles}
            data-testid={`${toTestId(group.id)}-group`}
         >
            <p className="mb-1 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
               {group.label}
            </p>
            {map(group.items, (entry) => navItem(entry))}
         </div>
      );
   };

   return (
      <aside className="lg:col-span-3" data-testid="navigation">
         <nav className="sticky top-8 space-y-1 rounded-lg border bg-card p-4 shadow-sm">
            {map(groups, (group, index) => navGroup(group, index))}
         </nav>
      </aside>
   );
};
