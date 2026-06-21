import z from "zod";

export const updateWorkflowEdgeSchema = z.object({
   toStepEdgeId: z.uuid("Ungültige Schritt-ID"),
   label: z
      .string()
      .min(1, "Bitte ein Label für diese Verbindung eingeben")
      .max(250),
   order: z.number().int().min(0),
});

export const updateWorkflowStepSchema = z
   .object({
      id: z.uuid().optional(),
      title: z.string().min(1, "Titel ist erforderlich").max(250),
      hint: z.string().max(750).nullish(),
      type: z.enum(["PROMPT_REF", "STANDALONE"]),
      promptId: z.uuid().nullish(),
      content: z.string().nullish(),
      isStart: z.boolean(),
      position: z.number().int().min(0),
      edgeId: z.uuid(),
      edges: z.array(updateWorkflowEdgeSchema),
   })
   .superRefine((data, ctx) => {
      if (data.type === "PROMPT_REF" && !data.promptId) {
         ctx.addIssue({
            code: "custom",
            message: "Bitte einen Prompt auswählen",
            path: ["promptId"],
         });
      }
      if (data.type === "STANDALONE" && !data.content?.trim()) {
         ctx.addIssue({
            code: "custom",
            message: "Prompt-Text darf nicht leer sein",
            path: ["content"],
         });
      }
   });

export const updateWorkflowSchema = z.object({
   title: z.string().min(1, "Titel ist erforderlich").max(250),
   description: z.string().max(750).nullish(),
   steps: z.array(updateWorkflowStepSchema),
});
