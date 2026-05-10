jest.mock("@/auth");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import RootPage from "./page";

const authMock = auth as jest.MockedFunction<typeof auth>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

describe("RootPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("RootPage - unauthenticated - renders landing page - test", async () => {
      authMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(RootPage, {});

      await waitFor(() => {
         assertInDocument(screen.getByTestId("public-page"));
      });

      expect(redirectMock).not.toHaveBeenCalled();
      expect(container).toMatchSnapshot();
   });

   it("RootPage - authenticated - redirects to /templates - test", async () => {
      authMock.mockResolvedValue({
         user: { id: "user-1", email: "test@example.com" },
         expires: new Date().toISOString(),
      });

      await renderAsyncRSC(RootPage, {});

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledWith("/templates");
      });
   });
});
