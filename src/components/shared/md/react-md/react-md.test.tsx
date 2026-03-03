jest.mock("./plugins/rehype-placeholders");

import { render, screen } from "@testing-library/react";
import { assertInDocument, assertStringifyEqual, dtestData } from "@tests";

import { rehypePlaceholders } from "./plugins/rehype-placeholders";
import { ReactMd, toRehypePlugins } from "./react-md";

const rehypePlaceholdersMock = rehypePlaceholders as jest.MockedFunction<
   typeof rehypePlaceholders
>;

const assertRendered = () => {
   const renderer = screen.getByTestId("react-md");
   assertInDocument(renderer);
};

describe("ReactMd rendering tests", () => {
   it("ReactMd - classnem undefined - rendered test", () => {
      const { container } = render(<ReactMd> text 1</ReactMd>);

      assertRendered();

      expect(container).toMatchSnapshot();
   });

   it("ReactMd - classnem defined - rendered test", () => {
      const { container } = render(
         <ReactMd className="flex-1"> text 1</ReactMd>
      );

      assertRendered();

      expect(container).toMatchSnapshot();
   });
});

describe("ReactMd funcitonality tests", () => {
   it("toRehypePlugins - valid plugins - test", () => {
      const values = dtestData.dPromptTemplateFieldValues();
      const plugins = [
         {
            type: "rehype-placeholders" as const,
            value: values,
         },
      ];
      const rehypePlugins = toRehypePlugins(plugins);
      const expectedRehypePlugins = [() => rehypePlaceholders(values)];
      assertStringifyEqual(rehypePlugins, expectedRehypePlugins);
      expect(rehypePlaceholdersMock).not.toHaveBeenCalled();

      const placeholdersPlugin = rehypePlugins[0];
      placeholdersPlugin();
      expect(rehypePlaceholdersMock).toHaveBeenCalledTimes(1);
      expect(rehypePlaceholdersMock).toHaveBeenCalledWith(values);
   });

   it("toRehypePlugins - invalid plugins - test", () => {
      const values = dtestData.dPromptTemplateFieldValues();
      const plugins = [
         {
            type: "invalid" as const,
            value: values,
         },
      ];

      const fn = () => toRehypePlugins(plugins);

      expect(fn).toThrow(Error);
   });
});
