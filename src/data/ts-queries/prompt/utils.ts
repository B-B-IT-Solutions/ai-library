export const promptTemplateKeys = {
   all: ["prompt-templates"],
   templates: () => {
      return [...promptTemplateKeys.all] as const;
   },
};

export const promptTemplateCategoryKeys = {
   all: ["prompt-template-categories"],
   categories: () => {
      return [...promptTemplateCategoryKeys.all] as const;
   },
};
