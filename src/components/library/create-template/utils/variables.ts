export type VariableStatus = {
   undefined: string[];
   used: string[];
   unused: string[];
};

export const extractVariablesFromContent = (content: string): string[] => {
   const regex = /\{\{(\w+)\}\}/g;
   const variables = new Set<string>();
   let match;

   while ((match = regex.exec(content)) !== null) {
      variables.add(match[1]);
   }
   return Array.from(variables);
};

export const getVariableStatus = (
   detectedVariables: string[],
   fieldNames: string[]
): VariableStatus => {
   return {
      // Variables in content that don't have fields defined
      undefined: detectedVariables.filter(
         (varName) => !fieldNames.includes(varName)
      ),
      // Fields that are used in content
      used: fieldNames.filter((fieldName) =>
         detectedVariables.includes(fieldName)
      ),
      // Fields that are not used in content
      unused: fieldNames.filter(
         (fieldName) => !detectedVariables.includes(fieldName)
      ),
   };
};
