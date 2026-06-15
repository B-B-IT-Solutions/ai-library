import z from "zod";

export const workflowEdgeInputSchema = z.object({
   toStepId: z.string().uuid("Ungültige Schritt-ID"),
   label: z
      .string()
      .min(1, "Bitte ein Label für diese Verbindung eingeben")
      .max(250),
   order: z.number().int().min(0),
});

export const createWorkflowSchema = z.object({
   title: z.string().min(1, "Titel ist erforderlich").max(250),
   description: z.string().max(750).nullish(),
});

export const updateWorkflowSchema = z.object({
   title: z.string().min(1, "Titel ist erforderlich").max(250),
   description: z.string().max(750).nullish(),
});

export const updateWorkflowStepSchema = z
   .object({
      title: z.string().min(1, "Titel ist erforderlich").max(250),
      hint: z.string().max(750).nullish(),
      type: z.enum(["PROMPT_REF", "STANDALONE"]),
      promptId: z.string().uuid().nullish(),
      content: z.string().nullish(),
      isStart: z.boolean(),
      position: z.number().int().min(0),
      edges: z.array(workflowEdgeInputSchema),
   })
   .superRefine((data, ctx) => {
      if (data.type === "PROMPT_REF" && !data.promptId) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Bitte ein Template auswählen",
            path: ["promptId"],
         });
      }
      if (data.type === "STANDALONE" && !data.content?.trim()) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Prompt-Text darf nicht leer sein",
            path: ["content"],
         });
      }
      // Prüfe auf Duplikat-Zielschritte
      const toStepIds = data.edges.map((e) => e.toStepId);
      const unique = new Set(toStepIds);
      if (unique.size !== toStepIds.length) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Dieser Schritt ist bereits als Ziel eingetragen",
            path: ["edges"],
         });
      }
   });
