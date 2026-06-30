import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { Metadata } from "next";

import {
   APP_DESCRIPTION,
   APP_NAME,
   getProdAppMetadataUrl,
} from "@/lib/constants";

import RootLayout, { generateMetadata, RootLayoutProps } from "./layout";

jest.mock("@/app/layout", () => ({
   __esModule: true,
   ...jest.requireActual("@/app/layout"),
   default: ({ children }: RootLayoutProps) => {
      return <div data-testid="root-layout">{children}</div>;
   },
}));

const assertRendered = () => {
   const layout = screen.getByTestId("root-layout");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(test1);
};

describe("RootLayout rendering tests", () => {
   it("RootLayout rendered", async () => {
      const { container } = render(
         <RootLayout>
            <div data-testid="test-1"></div>
         </RootLayout>
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("RootLayout functionality tests", () => {
   it("generateMetadata - test", async () => {
      const appUrl = getProdAppMetadataUrl();

      const metadata = await generateMetadata();

      const expectedMetadata: Metadata = {
         title: {
            template: `%s | ${APP_NAME}`,
            default: APP_NAME,
         },
         description: APP_DESCRIPTION,
         metadataBase: new URL(appUrl),
         alternates: {
            canonical: "/",
            languages: {
               "de-DE": "/de-DE",
            },
         },
      };

      expect(metadata).toEqual(expectedMetadata);
   });
});
