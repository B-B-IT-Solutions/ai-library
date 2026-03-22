import { waitFor } from "@testing-library/dom";
import { renderAsyncRSC } from "@tests";
import { redirect } from "next/navigation";

import MainPage from "./page";

const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

describe("MainPage rendering tests", () => {
   it("MainPage rendered test", async () => {
      const { container } = await renderAsyncRSC(MainPage, {});

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/library");
      });

      expect(container).toMatchSnapshot();
   });
});
