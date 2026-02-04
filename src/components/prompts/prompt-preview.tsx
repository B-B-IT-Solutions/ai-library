"use client";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { DPromptUpdate } from "@/data/types/domain/prompt";

type Props = {
   promptData: DPromptUpdate;
   onEdit: () => void;
   onSave: () => void;
   onCancel: () => void;
   isLoading?: boolean;
};

export const PromptPreview = ({
   promptData,
   onEdit,
   onSave,
   onCancel,
   isLoading,
}: Props) => {
   return (
      <div className="space-y-4">
         <Card>
            <CardHeader>
               <CardTitle>{promptData.title}</CardTitle>
               <div className="flex gap-2">
                  <Badge>{promptData.recommendedModel}</Badge>
                  {promptData.categories.map((cat) => (
                     <Badge key={cat} variant="outline">
                        {cat}
                     </Badge>
                  ))}
               </div>
            </CardHeader>
            <CardContent>
               <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                     {promptData.content}
                  </pre>
               </div>
            </CardContent>
         </Card>

         <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
               Abbrechen
            </Button>
            <Button variant="secondary" onClick={onEdit} disabled={isLoading}>
               Bearbeiten
            </Button>
            <Button onClick={onSave} disabled={isLoading}>
               {isLoading ? "Speichert..." : "Speichern"}
            </Button>
         </div>
      </div>
   );
};
