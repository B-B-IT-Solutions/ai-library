import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertHasClass,
   assertHasNoClass,
   assertInDocument,
} from "@tests";

import { ToolbarButton } from "./toolbar-button";

const mockIcon = <span data-testid="mock-icon">Icon</span>;
const mockOnClick = jest.fn();

const assertRendered = (title: string) => {
   const button = screen.getByRole("button");
   const icon = screen.getByTestId("mock-icon");

   assertInDocument(button);
   assertInDocument(icon);

   assertHasAttributeWithValue(button, "title", title);
   assertHasAttributeWithValue(button, "type", "button");
   assertHasClass(button, "p-2");
   assertHasClass(button, "rounded");
   assertHasClass(button, "hover:bg-slate-100");
   assertHasClass(button, "transition-colors");
};

const assertActiveTrue = () => {
   const button = screen.getByRole("button");
   assertHasClass(button, "bg-slate-200");
   assertHasClass(button, "text-blue-600");
   assertHasNoClass(button, "text-slate-700");
};

const assertActiveFalse = () => {
   const button = screen.getByRole("button");
   assertHasNoClass(button, "bg-slate-200");
   assertHasNoClass(button, "text-blue-600");
   assertHasClass(button, "text-slate-700");
};

describe("ToolbarButton rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("ToolbarButton - renders with basic props", async () => {
      const title = "Test Button";
      const { container } = render(
         <ToolbarButton onClick={mockOnClick} icon={mockIcon} title={title} />
      );

      await waitFor(() => {
         assertRendered(title);
      });

      expect(container).toMatchSnapshot();
   });

   it("ToolbarButton - renders in inactive state", async () => {
      const title = "Inactive Button";
      const { container } = render(
         <ToolbarButton
            onClick={mockOnClick}
            isActive={false}
            icon={mockIcon}
            title={title}
         />
      );

      await waitFor(() => {
         assertRendered(title);
         assertActiveFalse();
      });

      expect(container).toMatchSnapshot();
   });

   it("ToolbarButton - renders in active state", async () => {
      const title = "Active Button";
      const { container } = render(
         <ToolbarButton
            onClick={mockOnClick}
            isActive={true}
            icon={mockIcon}
            title={title}
         />
      );

      await waitFor(() => {
         assertRendered(title);
         assertActiveTrue();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ToolbarButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("ToolbarButton - onClick handler is called when clicked", async () => {
      const title = "Test Button";
      render(
         <ToolbarButton
            onClick={mockOnClick}
            icon={mockIcon}
            title={title}
            isActive={false}
         />
      );

      await waitFor(() => {
         assertRendered(title);
         expect(mockOnClick).not.toHaveBeenCalled();
      });

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
   });

   it("ToolbarButton - onClick handler is called multiple times", async () => {
      const title = "Test Button";
      render(
         <ToolbarButton
            onClick={mockOnClick}
            icon={mockIcon}
            title={title}
            isActive={true}
         />
      );

      await waitFor(() => {
         assertRendered(title);
         expect(mockOnClick).not.toHaveBeenCalled();
      });

      const button = screen.getByRole("button");
      await userEvent.click(button);
      await userEvent.click(button);
      await userEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
   });
});
