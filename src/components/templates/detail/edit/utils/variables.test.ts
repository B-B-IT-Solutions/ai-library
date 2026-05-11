import { extractVariablesFromContent, getVariableStatus } from "./variables";

describe("extractVariablesFromContent", () => {
   it("should return empty array when content has no variables", () => {
      const content = "This is a simple text without variables";
      const result = extractVariablesFromContent(content);

      expect(result).toEqual([]);
   });

   it("should extract a single variable from content", () => {
      const content = "Hello {{name}}!";
      const result = extractVariablesFromContent(content);

      expect(result).toEqual(["name"]);
   });

   it("should extract multiple variables from content", () => {
      const content =
         "Hello {{name}}, your email is {{email}} and age is {{age}}";
      const result = extractVariablesFromContent(content);

      expect(result).toHaveLength(3);
      expect(result).toContain("name");
      expect(result).toContain("email");
      expect(result).toContain("age");
   });

   it("should return unique variables when duplicates exist", () => {
      const content =
         "{{name}} is {{name}}, email is {{email}}, name again: {{name}}";
      const result = extractVariablesFromContent(content);

      expect(result).toHaveLength(2);
      expect(result).toContain("name");
      expect(result).toContain("email");
   });

   it("should extract variables from multiline content", () => {
      const content = `
         Hello {{firstName}},
         Your last name is {{lastName}}.
         Email: {{email}}
      `;
      const result = extractVariablesFromContent(content);

      expect(result).toHaveLength(3);
      expect(result).toContain("firstName");
      expect(result).toContain("lastName");
      expect(result).toContain("email");
   });

   it("should only extract valid variable names (word characters)", () => {
      const content = "{{validName}} {{valid_name}} {{valid123}}";
      const result = extractVariablesFromContent(content);

      expect(result).toHaveLength(3);
      expect(result).toContain("validName");
      expect(result).toContain("valid_name");
      expect(result).toContain("valid123");
   });

   it("should not extract variables with spaces", () => {
      const content = "{{ name }} {{valid}}";
      const result = extractVariablesFromContent(content);

      // Only {{valid}} should be extracted, not {{ name }}
      expect(result).toEqual(["valid"]);
   });

   it("should not extract variables with special characters", () => {
      const content = "{{name-test}} {{name.test}} {{name!}} {{validName}}";
      const result = extractVariablesFromContent(content);

      // Only {{validName}} should be extracted as it contains only word characters
      expect(result).toEqual(["validName"]);
   });

   it("should handle single braces (not variables)", () => {
      const content = "{name} {{email}} {address}";
      const result = extractVariablesFromContent(content);

      expect(result).toEqual(["email"]);
   });

   it("should handle triple braces", () => {
      const content = "{{{name}}} {{email}}";
      const result = extractVariablesFromContent(content);

      // Should extract 'name' from {{{name}}} and 'email' from {{email}}
      expect(result).toContain("name");
      expect(result).toContain("email");
   });

   it("should handle empty string", () => {
      const content = "";
      const result = extractVariablesFromContent(content);

      expect(result).toEqual([]);
   });

   it("should handle variables at the start and end of content", () => {
      const content = "{{start}} some text {{end}}";
      const result = extractVariablesFromContent(content);

      expect(result).toHaveLength(2);
      expect(result).toContain("start");
      expect(result).toContain("end");
   });

   it("should handle consecutive variables", () => {
      const content = "{{first}}{{second}}{{third}}";
      const result = extractVariablesFromContent(content);

      expect(result).toHaveLength(3);
      expect(result).toContain("first");
      expect(result).toContain("second");
      expect(result).toContain("third");
   });
});

describe("getVariableStatus", () => {
   describe("undefined variables", () => {
      it("should identify all variables as undefined when no fields are defined", () => {
         const detectedVariables = ["name", "email", "age"];
         const fieldNames: string[] = [];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.undefined).toEqual(["name", "email", "age"]);
         expect(result.used).toEqual([]);
         expect(result.unused).toEqual([]);
      });

      it("should identify some variables as undefined when not all are in fields", () => {
         const detectedVariables = ["name", "email", "age"];
         const fieldNames = ["name", "email"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.undefined).toEqual(["age"]);
         expect(result.used).toEqual(["name", "email"]);
         expect(result.unused).toEqual([]);
      });

      it("should have no undefined variables when all are defined in fields", () => {
         const detectedVariables = ["name", "email"];
         const fieldNames = ["name", "email", "age"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.undefined).toEqual([]);
         expect(result.used).toEqual(["name", "email"]);
         expect(result.unused).toEqual(["age"]);
      });
   });

   describe("used variables", () => {
      it("should identify all fields as used when all are in detected variables", () => {
         const detectedVariables = ["name", "email", "age"];
         const fieldNames = ["name", "email", "age"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.used).toEqual(["name", "email", "age"]);
         expect(result.undefined).toEqual([]);
         expect(result.unused).toEqual([]);
      });

      it("should identify some fields as used when they appear in detected variables", () => {
         const detectedVariables = ["name", "email"];
         const fieldNames = ["name", "email", "age", "address"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.used).toEqual(["name", "email"]);
         expect(result.undefined).toEqual([]);
         expect(result.unused).toEqual(["age", "address"]);
      });

      it("should have no used fields when no fields match detected variables", () => {
         const detectedVariables = ["name", "email"];
         const fieldNames = ["age", "address"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.used).toEqual([]);
         expect(result.undefined).toEqual(["name", "email"]);
         expect(result.unused).toEqual(["age", "address"]);
      });
   });

   describe("unused variables", () => {
      it("should identify all fields as unused when none are in detected variables", () => {
         const detectedVariables: string[] = [];
         const fieldNames = ["name", "email", "age"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.unused).toEqual(["name", "email", "age"]);
         expect(result.used).toEqual([]);
         expect(result.undefined).toEqual([]);
      });

      it("should identify some fields as unused when not all are detected", () => {
         const detectedVariables = ["name"];
         const fieldNames = ["name", "email", "age"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.unused).toEqual(["email", "age"]);
         expect(result.used).toEqual(["name"]);
         expect(result.undefined).toEqual([]);
      });

      it("should have no unused fields when all fields are detected", () => {
         const detectedVariables = ["name", "email", "age"];
         const fieldNames = ["name", "email"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.unused).toEqual([]);
         expect(result.used).toEqual(["name", "email"]);
         expect(result.undefined).toEqual(["age"]);
      });
   });

   describe("edge cases", () => {
      it("should handle empty detected variables and empty fields", () => {
         const detectedVariables: string[] = [];
         const fieldNames: string[] = [];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.undefined).toEqual([]);
         expect(result.used).toEqual([]);
         expect(result.unused).toEqual([]);
      });

      it("should handle single variable and single field matching", () => {
         const detectedVariables = ["name"];
         const fieldNames = ["name"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.undefined).toEqual([]);
         expect(result.used).toEqual(["name"]);
         expect(result.unused).toEqual([]);
      });

      it("should handle single variable and single field not matching", () => {
         const detectedVariables = ["name"];
         const fieldNames = ["email"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.undefined).toEqual(["name"]);
         expect(result.used).toEqual([]);
         expect(result.unused).toEqual(["email"]);
      });

      it("should preserve order of variables in each category", () => {
         const detectedVariables = ["z", "a", "m"];
         const fieldNames = ["a", "b", "c"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         // undefined should preserve order from detectedVariables
         expect(result.undefined).toEqual(["z", "m"]);
         // used should preserve order from fieldNames
         expect(result.used).toEqual(["a"]);
         // unused should preserve order from fieldNames
         expect(result.unused).toEqual(["b", "c"]);
      });
   });

   describe("complex scenarios", () => {
      it("should handle complex real-world scenario", () => {
         const detectedVariables = [
            "firstName",
            "lastName",
            "email",
            "company",
         ];
         const fieldNames = ["firstName", "lastName", "email", "phone", "age"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.undefined).toEqual(["company"]);
         expect(result.used).toEqual(["firstName", "lastName", "email"]);
         expect(result.unused).toEqual(["phone", "age"]);
      });

      it("should handle scenario with more fields than detected variables", () => {
         const detectedVariables = ["name"];
         const fieldNames = [
            "name",
            "email",
            "age",
            "address",
            "phone",
            "company",
         ];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.undefined).toEqual([]);
         expect(result.used).toEqual(["name"]);
         expect(result.unused).toEqual([
            "email",
            "age",
            "address",
            "phone",
            "company",
         ]);
      });

      it("should handle scenario with more detected variables than fields", () => {
         const detectedVariables = [
            "name",
            "email",
            "age",
            "address",
            "phone",
            "company",
         ];
         const fieldNames = ["name"];

         const result = getVariableStatus(detectedVariables, fieldNames);

         expect(result.undefined).toEqual([
            "email",
            "age",
            "address",
            "phone",
            "company",
         ]);
         expect(result.used).toEqual(["name"]);
         expect(result.unused).toEqual([]);
      });
   });
});
