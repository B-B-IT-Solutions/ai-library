"use client";

import { FC } from "react";
import { X } from "lucide-react";
import { Control } from "react-hook-form";

import { AutosizeTextarea } from "@/components/shadcn/autosize-textarea";
import { Button } from "@/components/shadcn/button";
import { FormControl, FormField, FormItem } from "@/components/shadcn/form";

import { PromptFormValues } from "./follow-up-prompts-edit";

type FollowUpPromptEditProps = {
   control: Control<PromptFormValues>;
   idx: number;
   removeFollowUpPrompt: (index: number) => void;
};

export const FollowUpPromptEdit: FC<FollowUpPromptEditProps> = ({
   control,
   idx,
   removeFollowUpPrompt,
}) => {
   return (
      <FormField
         control={control}
         name={`followUpPrompts.${idx}`}
         render={({ field }) => (
            <FormItem>
               <div className="flex gap-2 items-start">
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
                     onClick={() => removeFollowUpPrompt(idx)}
                     className="shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  >
                     <X className="h-4 w-4" />
                  </Button>
               </div>
            </FormItem>
         )}
      />
   );
};
