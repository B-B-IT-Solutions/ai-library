import { waitFor } from "@testing-library/dom";
import { renderAsyncRSC } from "@tests";
import { redirect } from "next/navigation";

import SettingsPage from "./page";

const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

describe("SettingsPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SettingsPage - rendered - test", async () => {
      const { container } = await renderAsyncRSC(SettingsPage, {});

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/settings/general");
      });

      expect(container).toMatchSnapshot();
   });
});
