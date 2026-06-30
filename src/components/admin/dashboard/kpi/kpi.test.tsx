import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderWithReactQuery } from "@tests";
import { FileText } from "lucide-react";

import { Kpi } from "./kpi";

const assertRendered = () => {
   const kpi = screen.getByTestId("kpi");
   assertInDocument(kpi);
};

describe("Kpi rendering tests", () => {
   it("subtitle undefined - test", async () => {
      const { container } = renderWithReactQuery(
         <Kpi title="title 1" value={49} icon={FileText} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("subtitle defined - test", async () => {
      const { container } = renderWithReactQuery(
         <Kpi
            title="title 123"
            value="49"
            subtitle="subtitle 123"
            icon={FileText}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
