// Helper function to extract variables from template content
export const extractVariablesFromContent = (content: string): string[] => {
   const regex = /\{\{(\w+)\}\}/g;
   const variables = new Set<string>();
   let match;

   while ((match = regex.exec(content)) !== null) {
      variables.add(match[1]);
   }

   return Array.from(variables);
};

// Helper function to capitalize first letter
export const capitalizeFirstLetter = (str: string): string => {
   return str.charAt(0).toUpperCase() + str.slice(1);
};

// Determine variable status
export const getVariableStatus = (
   detectedVariables: string[],
   fieldNames: string[]
) => {
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
