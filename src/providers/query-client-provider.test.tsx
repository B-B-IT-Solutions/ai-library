import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import * as queryClient from "@/providers/get-query-client";

import { TsQueryClientProvider } from "./query-client-provider";

const assertRendered = () => {
   const test1 = screen.getByTestId("test-1");
   assertInDocument(test1);
};

describe("TsQueryClientProvider rendering tests", () => {
   it("TsQueryClientProvider rendered", async () => {
      const getQueryClientFn = jest.spyOn(queryClient, "getQueryClient");

      const { container } = render(
         <TsQueryClientProvider>
            <div data-testid="test-1"></div>
         </TsQueryClientProvider>
      );

      await waitFor(() => {
         assertRendered();
         expect(getQueryClientFn).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
