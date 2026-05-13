"use client";

import { FC } from "react";
import { X } from "lucide-react";
import { Control } from "react-hook-form";

import { AutosizeTextarea } from "@/components/shadcn/autosize-textarea";
import { Button } from "@/components/shadcn/button";
import { FormControl, FormField, FormItem } from "@/components/shadcn/form";
import { DPrompt0Update } from "@/data/types/domain/prompt0";

type PromptFollowUpEditProps = {
   index: number;
   control: Control<DPrompt0Update>;
   removeFollowUpPrompt: (index: number) => void;
};

export const PromptFollowUpEdit: FC<PromptFollowUpEditProps> = ({
   index,
   control,
   removeFollowUpPrompt,
}) => {
   return (
      <FormField
         control={control}
         name={`followUpPrompts.${index}.content`}
         render={({ field }) => (
            <FormItem data-testid="follow-up-prompt-edit">
               <div className="flex items-start gap-2">
                  <FormControl>
                     <AutosizeTextarea
                        placeholder="Folge-Prompt eingeben"
                        className="flex-1"
                        minHeight={60}
                        {...field}
                     />
                  </FormControl>
                  <Button
                     type="button"
                     variant="outline"
                     size="icon"
                     onClick={() => removeFollowUpPrompt(index)}
                     className="shrink-0 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                     data-testid="remove-btn"
                  >
                     <X className="h-4 w-4" />
                  </Button>
               </div>
            </FormItem>
         )}
      />
   );
};
