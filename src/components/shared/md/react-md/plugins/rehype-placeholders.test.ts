import { DPromptVariableValues } from "@/data/types/domain/prompt";

import { rehypePlaceholders } from "./rehype-placeholders";

const GREEN_CLASS = "rounded bg-green-100 px-0.5 font-medium text-green-800";
const ORANGE_CLASS = "rounded bg-orange-100 px-0.5 italic text-orange-700";

const makeSpan = (className: string, text: string) => ({
   type: "element",
   tagName: "span",
   properties: { className },
   children: [{ type: "text", value: text }],
});

const makeTextNode = (value: string) => ({ type: "text", value });

const runPlugin = (textContent: string, values: DPromptVariableValues) => {
   const parent = {
      type: "element",
      tagName: "p",
      properties: {},
      children: [makeTextNode(textContent)],
   };

   const tree = { type: "root", children: [parent] };
   const transformer = rehypePlaceholders(values);
   transformer(tree);
   return parent.children;
};

describe("rehypePlaceholders - no placeholders", () => {
   it("leaves plain text unchanged", () => {
      const children = runPlugin("Hello World!", {});
      expect(children).toEqual([makeTextNode("Hello World!")]);
   });

   it("leaves empty text unchanged", () => {
      const children = runPlugin("", {});
      expect(children).toEqual([makeTextNode("")]);
   });

   it("ignores invalid placeholder syntax (starts with digit)", () => {
      const children = runPlugin("{{123invalid}}", {});
      expect(children).toEqual([makeTextNode("{{123invalid}}")]);
   });

   it("ignores dashes in placeholder names", () => {
      const children = runPlugin("{{also-invalid}}", {});
      expect(children).toEqual([makeTextNode("{{also-invalid}}")]);
   });
});

describe("rehypePlaceholders - filled values", () => {
   it("replaces placeholder with green span when value is present", () => {
      const children = runPlugin("{{name}}", { name: "Alice" });
      expect(children).toEqual([makeSpan(GREEN_CLASS, "Alice")]);
   });

   it("converts numeric value to string", () => {
      const children = runPlugin("{{count}}", { count: 42 });
      expect(children).toEqual([makeSpan(GREEN_CLASS, "42")]);
   });

   it("handles leading text before placeholder", () => {
      const children = runPlugin("Hello {{name}}", { name: "Bob" });
      expect(children).toEqual([
         makeTextNode("Hello "),
         makeSpan(GREEN_CLASS, "Bob"),
      ]);
   });

   it("handles trailing text after placeholder", () => {
      const children = runPlugin("{{name}}!", { name: "Bob" });
      expect(children).toEqual([
         makeSpan(GREEN_CLASS, "Bob"),
         makeTextNode("!"),
      ]);
   });

   it("handles text surrounding a placeholder", () => {
      const children = runPlugin("Hello {{name}}!", { name: "World" });
      expect(children).toEqual([
         makeTextNode("Hello "),
         makeSpan(GREEN_CLASS, "World"),
         makeTextNode("!"),
      ]);
   });

   it("handles whitespace inside placeholder braces", () => {
      const children = runPlugin("{{  name  }}", { name: "Alice" });
      expect(children).toEqual([makeSpan(GREEN_CLASS, "Alice")]);
   });

   it("replaces multiple filled placeholders", () => {
      const children = runPlugin("{{greeting}} {{name}}!", {
         greeting: "Hi",
         name: "Eve",
      });
      expect(children).toEqual([
         makeSpan(GREEN_CLASS, "Hi"),
         makeTextNode(" "),
         makeSpan(GREEN_CLASS, "Eve"),
         makeTextNode("!"),
      ]);
   });
});

describe("rehypePlaceholders - missing / empty values", () => {
   it("renders orange span with placeholder text when value is missing", () => {
      const children = runPlugin("{{name}}", {});
      expect(children).toEqual([makeSpan(ORANGE_CLASS, "{{name}}")]);
   });

   it("renders orange span when value is null", () => {
      const children = runPlugin("{{name}}", { name: null });
      expect(children).toEqual([makeSpan(ORANGE_CLASS, "{{name}}")]);
   });

   it("renders orange span when value is undefined", () => {
      const children = runPlugin("{{name}}", { name: undefined });
      expect(children).toEqual([makeSpan(ORANGE_CLASS, "{{name}}")]);
   });

   it("renders orange span when value is empty string", () => {
      const children = runPlugin("{{name}}", { name: "" });
      expect(children).toEqual([makeSpan(ORANGE_CLASS, "{{name}}")]);
   });
});

describe("rehypePlaceholders - mixed filled and missing", () => {
   it("renders green for filled and orange for missing placeholder", () => {
      const children = runPlugin("{{a}} and {{b}}", { a: "yes" });
      expect(children).toEqual([
         makeSpan(GREEN_CLASS, "yes"),
         makeTextNode(" and "),
         makeSpan(ORANGE_CLASS, "{{b}}"),
      ]);
   });

   it("handles multiple placeholders with all values provided", () => {
      const children = runPlugin("{{x}}-{{y}}-{{z}}", {
         x: "1",
         y: "2",
         z: "3",
      });
      expect(children).toEqual([
         makeSpan(GREEN_CLASS, "1"),
         makeTextNode("-"),
         makeSpan(GREEN_CLASS, "2"),
         makeTextNode("-"),
         makeSpan(GREEN_CLASS, "3"),
      ]);
   });

   it("ignores unrelated values not in template", () => {
      const children = runPlugin("{{name}}", { name: "Joe", age: "30" });
      expect(children).toEqual([makeSpan(GREEN_CLASS, "Joe")]);
   });
});

describe("rehypePlaceholders - multiple text nodes in same parent", () => {
   it("processes all text nodes independently", () => {
      const parent = {
         type: "element",
         tagName: "p",
         properties: {},
         children: [
            makeTextNode("{{a}}"),
            makeTextNode(" separator "),
            makeTextNode("{{b}}"),
         ],
      };

      const tree = { type: "root", children: [parent] };
      const transformer = rehypePlaceholders({ a: "first", b: "second" });
      transformer(tree);

      expect(parent.children).toEqual([
         makeSpan(GREEN_CLASS, "first"),
         makeTextNode(" separator "),
         makeSpan(GREEN_CLASS, "second"),
      ]);
   });

   it("produces correct node count when replacing one placeholder with two surrounding text nodes", () => {
      const parent = {
         type: "element",
         tagName: "p",
         properties: {},
         children: [makeTextNode("{{a}} {{b}}")],
      };

      const tree = { type: "root", children: [parent] };
      const transformer = rehypePlaceholders({ a: "1", b: "2" });
      transformer(tree);

      // [span("1"), text(" "), span("2")]
      expect(parent.children).toHaveLength(3);
      expect(parent.children[1]).toEqual(makeTextNode(" "));
   });
});

describe("rehypePlaceholders - tree with no text nodes", () => {
   it("does not modify a tree without text nodes", () => {
      const tree = {
         type: "root",
         children: [
            {
               type: "element",
               tagName: "div",
               properties: {},
               children: [],
            },
         ],
      };
      const transformer = rehypePlaceholders({ name: "Alice" });
      transformer(tree);

      expect(tree.children[0].children).toEqual([]);
   });
});

describe("rehypePlaceholders - guard: index undefined / no parent", () => {
   it("does not modify a root-level text node (index and parent are undefined)", () => {
      // When the tree itself is a text node, visit calls the visitor with
      // index=undefined and parent=undefined — the guard `if (index === undefined || !parent) return`
      // must fire and leave the node unchanged.
      const tree = { type: "text", value: "{{name}}" };
      const transformer = rehypePlaceholders({ name: "Alice" });
      transformer(tree);

      expect(tree.value).toBe("{{name}}");
   });
});
