import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { CreateTemplateButton } from "./create-template-button";

const assertRendered = () => {
   const btn = screen.getByTestId("create-template-btn");
   assertInDocument(btn);
};

describe("CreateTemplateButton rendering tests", () => {
   it("size - undefined - rendered test", async () => {
      const { container } = render(<CreateTemplateButton />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("size - sm - rendered test", async () => {
      const { container } = render(<CreateTemplateButton size="sm" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("atLimit true - test", async () => {
      const { container } = render(<CreateTemplateButton atLimit={true} />);

      await waitFor(() => {
         assertRendered();
      });

      const btn = screen.getByTestId("create-template-btn");
      expect(btn).toBeDisabled();

      const tooltip = screen.getByTestId("create-template-btn-tooltip");
      assertInDocument(tooltip);

      expect(container).toMatchSnapshot();
   });
});

describe("CreateTemplateButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("create btn clicked - test", async () => {
      render(<CreateTemplateButton />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const btn = screen.getByTestId("create-template-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates/new");
      });
   });
});
