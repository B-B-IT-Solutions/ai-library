"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { FieldLabel } from "@/components/shadcn/field";

export const AppearanceSection = () => {
   const { theme, setTheme } = useTheme();

   const themes = [
      {
         value: "light",
         label: "Licht",
         icon: Sun,
         description: "Helles Farbschema",
      },
      {
         value: "dark",
         label: "Dunkel",
         icon: Moon,
         description: "Dunkles Farbschema",
      },
      {
         value: "system",
         label: "System",
         icon: Monitor,
         description: "Folgt den Systemeinstellungen",
      },
   ];

   return (
      <Card data-testid="appearance">
         <CardHeader>
            <CardTitle>Erscheinungsbild</CardTitle>
            <CardDescription>
               Wählen Sie Ihr bevorzugtes Farbschema
            </CardDescription>
         </CardHeader>
         <CardContent>
            <div className="space-y-3">
               <FieldLabel className="text-sm font-medium">
                  Farbschema
               </FieldLabel>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {themes.map((themeOption) => {
                     const Icon = themeOption.icon;
                     const isSelected = theme === themeOption.value;

                     return (
                        <button
                           key={themeOption.value}
                           onClick={() => setTheme(themeOption.value)}
                           className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                              isSelected
                                 ? "border-primary bg-primary/5"
                                 : "border-border hover:border-primary/50 hover:bg-accent"
                           }`}
                        >
                           <Icon
                              className={`h-6 w-6 ${
                                 isSelected
                                    ? "text-primary"
                                    : "text-muted-foreground"
                              }`}
                           />
                           <div className="text-center">
                              <p
                                 className={`text-sm font-medium ${
                                    isSelected
                                       ? "text-primary"
                                       : "text-foreground"
                                 }`}
                              >
                                 {themeOption.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                 {themeOption.description}
                              </p>
                           </div>
                        </button>
                     );
                  })}
               </div>
            </div>
         </CardContent>
      </Card>
   );
};
