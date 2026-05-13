jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithTooltip } from "@tests";
import { toast } from "sonner";

import { toggleFavorite } from "@/data/actions/prompt";

import { ToggleFavoriteButton } from "./toggle-favorite-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const toggleFavoriteMock = toggleFavorite as jest.MockedFunction<
   typeof toggleFavorite
>;

const assertRendered = () => {
   const toggleBtn = screen.getByTestId("toggle-favorite-btn");
   assertInDocument(toggleBtn);
};

describe("ToggleFavoriteButton rendering tests", () => {
   it("ToggleFavoriteButton - isFavorite true - test", async () => {
      const prompt = dtestData.dPrompt0();
      prompt.isFavorite = true;

      const { container } = renderWithTooltip(
         <ToggleFavoriteButton prompt={prompt} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("ToggleFavoriteButton - isFavorite false - test", async () => {
      const prompt = dtestData.dPrompt0();
      prompt.isFavorite = false;

      const { container } = renderWithTooltip(
         <ToggleFavoriteButton prompt={prompt} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ToggleFavoriteButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("ToggleFavoriteButton - toggle btn clicked - result.success true - test", async () => {
      const actionResult = {
         success: true,
         message: "prompt added to favorites",
      };
      toggleFavoriteMock.mockResolvedValue(actionResult);

      const prompt = dtestData.dPrompt0();
      renderWithTooltip(<ToggleFavoriteButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(toggleFavoriteMock).not.toHaveBeenCalled();
      });

      const toggleBtn = screen.getByTestId("toggle-favorite-btn");
      await userEvent.click(toggleBtn);

      await waitFor(() => {
         expect(toggleFavoriteMock).toHaveBeenCalledTimes(1);
         expect(toggleFavoriteMock).toHaveBeenCalledWith(
            prompt.id,
            !prompt.isFavorite
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
      });
   });

   it("ToggleFavoriteButton - toggle btn clicked - result.success false - test", async () => {
      const actionResult = {
         success: false,
         message: "prompt couldn't be added to favorites",
      };
      toggleFavoriteMock.mockResolvedValue(actionResult);

      const prompt = dtestData.dPrompt0();
      renderWithTooltip(<ToggleFavoriteButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(toggleFavoriteMock).not.toHaveBeenCalled();
      });

      const toggleBtn = screen.getByTestId("toggle-favorite-btn");
      await userEvent.click(toggleBtn);

      await waitFor(() => {
         expect(toggleFavoriteMock).toHaveBeenCalledTimes(1);
         expect(toggleFavoriteMock).toHaveBeenCalledWith(
            prompt.id,
            !prompt.isFavorite
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
      });
   });
});
