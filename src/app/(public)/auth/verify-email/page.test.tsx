import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import VerifyEmailPage, { metadata, PageProps, PageSearchParams } from "./page";

const expectedMetadata: Metadata = {
   title: "E-Mail bestätigen",
};

const assertRendered = () => {
   const page = screen.getByTestId("verify-email-page");
   const title = screen.getByTestId("title");
   const description = screen.getByTestId("description");
   const form = screen.getByTestId("verify-email-form");

   assertInDocument(page);
   assertInDocument(title);
   assertInDocument(description);
   assertInDocument(form);
};

describe("VerifyEmailPage rendering tests", () => {
   it("email defined - test", async () => {
      const searchParams: PageSearchParams = {
         email: "user@test.com",
      };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(VerifyEmailPage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("email undefined - test", async () => {
      const searchParams: PageSearchParams = {};
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(VerifyEmailPage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("VerifyEmailPage functionality tests", () => {
   it("metadata - test", () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
