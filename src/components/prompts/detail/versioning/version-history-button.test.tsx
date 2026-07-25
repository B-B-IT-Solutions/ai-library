jest.mock("next-auth/react");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertHasAttributeWithValue, assertInDocument, dtestData } from "@tests";
import { useSession } from "next-auth/react";

import { DPromptVersionsResult } from "@/data/types/domain/prompt";

import { VersionHistoryButton } from "./version-history-button";

const useSessionMock = useSession as jest.MockedFunction<typeof useSession>;

const assertRendered = () => {
   assertInDocument(screen.getByTestId("version-history-btn"));
};

describe("VersionHistoryButton rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      useSessionMock.mockReturnValue({
         data: {
            user: { id: "user-1", email: "test@test.com", role: "USER", tier: "BASIC" },
            expires: "2099-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });
   });

   it("locked - badge not shown, opens upgrade dialog on click - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const versionsResult: DPromptVersionsResult = { locked: true };

      render(
         <VersionHistoryButton
            prompt={prompt}
            versionsResult={versionsResult}
            globalFields={[]}
         />
      );

      assertRendered();
      expect(screen.queryByTestId("version-history-badge")).not.toBeInTheDocument();

      await userEvent.click(screen.getByTestId("version-history-btn"));

      await waitFor(() => {
         assertInDocument(screen.getByTestId("version-history-upgrade-dialog"));
      });
      assertHasAttributeWithValue(
         screen.getByTestId("upgrade-btn"),
         "href",
         "/subscription/pricing"
      );
   });

   it("unlocked - zero versions - no badge shown - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const versionsResult: DPromptVersionsResult = {
         locked: false,
         page: dtestData.dPromptVersionsPage(0),
         hasUnversionedChanges: false,
      };

      render(
         <VersionHistoryButton
            prompt={prompt}
            versionsResult={versionsResult}
            globalFields={[]}
         />
      );

      assertRendered();
      expect(
         screen.queryByTestId("version-history-badge")
      ).not.toBeInTheDocument();
   });

   it("unlocked - versions exist - badge shows total count, opens sheet on click - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const page = dtestData.dPromptVersionsPage(3);
      const versionsResult: DPromptVersionsResult = {
         locked: false,
         page,
         hasUnversionedChanges: false,
      };

      render(
         <VersionHistoryButton
            prompt={prompt}
            versionsResult={versionsResult}
            globalFields={[]}
         />
      );

      assertRendered();
      expect(screen.getByTestId("version-history-badge")).toHaveTextContent(
         String(page.totalElements)
      );

      await userEvent.click(screen.getByTestId("version-history-btn"));

      await waitFor(() => {
         assertInDocument(screen.getByTestId("version-history-sheet"));
      });
   });
});
