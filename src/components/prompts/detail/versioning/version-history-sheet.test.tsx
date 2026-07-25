jest.mock("next-auth/react");
jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { useSession } from "next-auth/react";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import {
   getPromptVersion,
   getPromptVersions,
   restorePromptVersion,
} from "@/data/actions/prompt";
import {
   DPromptVersion,
   DPromptVersionsPage,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { ActionResult } from "@/data/types/utils";

import { VersionHistorySheet } from "./version-history-sheet";

const useSessionMock = useSession as jest.MockedFunction<typeof useSession>;
const getPromptVersionMock = getPromptVersion as jest.MockedFunction<
   typeof getPromptVersion
>;
const getPromptVersionsMock = getPromptVersions as jest.MockedFunction<
   typeof getPromptVersions
>;
const restorePromptVersionMock = restorePromptVersion as jest.MockedFunction<
   typeof restorePromptVersion
>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const mockSession = (tier: "FREE" | "BASIC" | "PRO" = "BASIC") => {
   useSessionMock.mockReturnValue({
      data: {
         user: { id: "user-1", email: "test@test.com", role: "USER", tier },
         expires: "2099-12-31",
      },
      status: "authenticated",
      update: jest.fn(),
   });
};

const buildPrompt = (): DPromptWithContent => {
   const prompt = dtestData.dPromptWithContent();
   prompt.content = "Current content";
   prompt.fields = [dtestData.dPromptVariable(0)];
   prompt.fields[0].name = "known_field";
   prompt.globalFieldIds = [];
   return prompt;
};

const globalFields: DGlobalPromptField[] = [];

describe("VersionHistorySheet rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/prompts/prompt-1");
      mockSession("BASIC");
   });

   it("open true - renders current fassung and version entries - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = dtestData.dPromptVersionsPage(2);

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={true}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("version-history-sheet"));
         assertInDocument(screen.getByTestId("current-version-entry"));
         expect(screen.getAllByTestId("version-entry")).toHaveLength(2);
      });

      assertInDocument(screen.getByTestId("unversioned-changes-hint"));
   });

   it("no unversioned changes - hint not shown - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = dtestData.dPromptVersionsPage(1);

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("version-history-sheet"));
      });

      expect(
         screen.queryByTestId("unversioned-changes-hint")
      ).not.toBeInTheDocument();
   });

   it("zero versions - empty state shown - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = dtestData.dPromptVersionsPage(0);

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("no-versions-hint"));
      });
   });

   it("BASIC tier - totalElements >= 15 - shows limit hint - test", async () => {
      mockSession("BASIC");
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = {
         ...dtestData.dPromptVersionsPage(3),
         totalElements: 16,
      };

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("basic-limit-hint"));
      });
   });

   it("PRO tier - totalElements >= 15 - limit hint not shown - test", async () => {
      mockSession("PRO");
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = {
         ...dtestData.dPromptVersionsPage(3),
         totalElements: 20,
      };

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("version-history-sheet"));
      });

      expect(
         screen.queryByTestId("basic-limit-hint")
      ).not.toBeInTheDocument();
   });

   it("hasMore - load more btn shown, clicking appends versions - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = {
         content: dtestData.dPromptVersionSummaries(1),
         pageNumber: 0,
         pageSize: 1,
         numberOfElements: 1,
         totalPages: 2,
         totalElements: 2,
      };

      const nextPageSummary = dtestData.dPromptVersionSummary(2);
      getPromptVersionsMock.mockResolvedValue({
         locked: false,
         page: {
            content: [nextPageSummary],
            pageNumber: 1,
            pageSize: 1,
            numberOfElements: 1,
            totalPages: 2,
            totalElements: 2,
         },
         hasUnversionedChanges: false,
      });

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      const loadMoreBtn = screen.getByTestId("load-more-btn");
      await userEvent.click(loadMoreBtn);

      await waitFor(() => {
         expect(screen.getAllByTestId("version-entry")).toHaveLength(2);
      });
      expect(getPromptVersionsMock).toHaveBeenCalledWith(prompt.id, {
         pagination: { pageNumber: 1, pageSize: 1 },
      });
   });

   it("no more pages - load more btn not shown - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = dtestData.dPromptVersionsPage(2);

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("version-history-sheet"));
      });

      expect(screen.queryByTestId("load-more-btn")).not.toBeInTheDocument();
   });

   it("view btn clicked - fetches and displays version content, toggles closed on second click - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = dtestData.dPromptVersionsPage(1);
      const version: DPromptVersion = {
         ...dtestData.dPromptVersion(1),
         id: page.content[0].id,
         content: "Historical content",
      };
      getPromptVersionMock.mockResolvedValue(version);

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      const viewBtn = screen.getByTestId("view-version-btn");
      await userEvent.click(viewBtn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("version-content"));
         expect(screen.getByTestId("version-content")).toHaveTextContent(
            "Historical content"
         );
      });
      expect(getPromptVersionMock).toHaveBeenCalledWith(
         prompt.id,
         version.id
      );

      // second click collapses
      await userEvent.click(viewBtn);
      expect(screen.queryByTestId("version-content")).not.toBeInTheDocument();
   });

   it("restore btn clicked - opens restore dialog with variable mismatch warning - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = dtestData.dPromptVersionsPage(1);
      const version: DPromptVersion = {
         ...dtestData.dPromptVersion(1),
         id: page.content[0].id,
         versionNumber: page.content[0].versionNumber,
         content: "Contains {{unknown_field}}",
      };
      getPromptVersionMock.mockResolvedValue(version);

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await userEvent.click(screen.getByTestId("restore-version-btn"));

      await waitFor(() => {
         assertInDocument(screen.getByTestId("restore-version-dialog"));
         assertInDocument(screen.getByTestId("variable-mismatch-warning"));
      });
      expect(screen.getByTestId("variable-mismatch-warning")).toHaveTextContent(
         "unknown_field"
      );
   });

   it("restore confirmed - success - closes dialog+sheet and refreshes router - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = dtestData.dPromptVersionsPage(1);
      const version: DPromptVersion = {
         ...dtestData.dPromptVersion(1),
         id: page.content[0].id,
         content: "Historical content",
      };
      getPromptVersionMock.mockResolvedValue(version);

      const result: ActionResult = {
         success: true,
         message: "Version wiederhergestellt",
      };
      restorePromptVersionMock.mockResolvedValue(result);

      const onOpenChange = jest.fn();

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={onOpenChange}
         />
      );

      await userEvent.click(screen.getByTestId("restore-version-btn"));
      await waitFor(() => {
         assertInDocument(screen.getByTestId("restore-version-dialog"));
      });

      await userEvent.click(screen.getByTestId("confirm-restore-btn"));

      await waitFor(() => {
         expect(restorePromptVersionMock).toHaveBeenCalledWith(
            prompt.id,
            version.id,
            true
         );
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(onOpenChange).toHaveBeenCalledWith(false);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("restore confirmed - upgradeRequired - shows upgrade toast action - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = dtestData.dPromptVersionsPage(1);
      const version: DPromptVersion = {
         ...dtestData.dPromptVersion(1),
         id: page.content[0].id,
         content: "Historical content",
      };
      getPromptVersionMock.mockResolvedValue(version);

      const result: ActionResult = {
         success: false,
         message: "Versionsverlauf ist ab BASIC verfügbar.",
         upgradeRequired: true,
      };
      restorePromptVersionMock.mockResolvedValue(result);

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await userEvent.click(screen.getByTestId("restore-version-btn"));
      await waitFor(() => {
         assertInDocument(screen.getByTestId("restore-version-dialog"));
      });

      await userEvent.click(screen.getByTestId("confirm-restore-btn"));

      await waitFor(() => {
         expect(toastMock.error).toHaveBeenCalledWith(
            result.message,
            expect.objectContaining({
               action: expect.objectContaining({ label: "Upgrade" }),
            })
         );
      });
   });

   it("restore confirmed - generic failure - shows error toast - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = dtestData.dPromptVersionsPage(1);
      const version: DPromptVersion = {
         ...dtestData.dPromptVersion(1),
         id: page.content[0].id,
         content: "Historical content",
      };
      getPromptVersionMock.mockResolvedValue(version);

      const result: ActionResult = {
         success: false,
         message: "Version konnte nicht wiederhergestellt werden",
      };
      restorePromptVersionMock.mockResolvedValue(result);

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await userEvent.click(screen.getByTestId("restore-version-btn"));
      await waitFor(() => {
         assertInDocument(screen.getByTestId("restore-version-dialog"));
      });

      await userEvent.click(screen.getByTestId("confirm-restore-btn"));

      await waitFor(() => {
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
      });
   });

   it("restore - uncheck keep-current - calls with keepCurrentAsVersion false - test", async () => {
      const prompt = buildPrompt();
      const page: DPromptVersionsPage = dtestData.dPromptVersionsPage(1);
      const version: DPromptVersion = {
         ...dtestData.dPromptVersion(1),
         id: page.content[0].id,
         content: "Historical content",
      };
      getPromptVersionMock.mockResolvedValue(version);
      restorePromptVersionMock.mockResolvedValue({
         success: true,
         message: "Version wiederhergestellt",
      });

      render(
         <VersionHistorySheet
            prompt={prompt}
            globalFields={globalFields}
            initialPage={page}
            initialHasUnversionedChanges={false}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await userEvent.click(screen.getByTestId("restore-version-btn"));
      await waitFor(() => {
         assertInDocument(screen.getByTestId("restore-version-dialog"));
      });

      await userEvent.click(
         screen.getByTestId("keep-current-as-version-checkbox")
      );
      await userEvent.click(screen.getByTestId("confirm-restore-btn"));

      await waitFor(() => {
         expect(restorePromptVersionMock).toHaveBeenCalledWith(
            prompt.id,
            version.id,
            false
         );
      });
   });
});
