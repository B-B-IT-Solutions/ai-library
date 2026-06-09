jest.mock("@/data/ts-queries/prompt");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   ctestData,
   dtestData,
   renderWithReactQuery,
} from "@tests";
import { toast } from "sonner";

import {
   type UpdateIsFavoriteParams,
   useToggleFavorite,
} from "@/data/ts-queries/prompt";

import { AddToFavoriteButton } from "./add-to-favorite-button";

type UseToggleFavoriteResult = ReturnType<typeof useToggleFavorite>;

const toastMock = toast as jest.MockedFunction<typeof toast>;
const useToggleFavoriteMock = useToggleFavorite as jest.MockedFunction<
   typeof useToggleFavorite
>;

const assertRendered = () => {
   const toggleBtn = screen.getByTestId("toggle-favorite-btn");
   assertInDocument(toggleBtn);
};

const mutationResultMock = (mutateFn = jest.fn()): UseToggleFavoriteResult => {
   const result = ctestData.useMutationResultMock(mutateFn);
   return result as UseToggleFavoriteResult;
};

describe("AddToFavoriteButton rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("AddToFavoriteButton - variant card - test", async () => {
      const result = mutationResultMock();
      useToggleFavoriteMock.mockReturnValue(result);

      const descriptor = dtestData.dPrompt();

      const { container } = renderWithReactQuery(
         <AddToFavoriteButton descriptor={descriptor} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("AddToFavoriteButton - variant inline - isFavorite true - test", async () => {
      const result = mutationResultMock();
      useToggleFavoriteMock.mockReturnValue(result);

      const descriptor = dtestData.dPrompt();
      descriptor.isFavorite = true;

      const { container } = renderWithReactQuery(
         <AddToFavoriteButton descriptor={descriptor} variant="inline" />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("AddToFavoriteButton - variant inline - isFavorite false - hideInactive true - test", async () => {
      const result = mutationResultMock();
      useToggleFavoriteMock.mockReturnValue(result);

      const descriptor = dtestData.dPrompt();
      descriptor.isFavorite = false;

      const { container } = renderWithReactQuery(
         <AddToFavoriteButton
            descriptor={descriptor}
            variant="inline"
            hideInactive={true}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("AddToFavoriteButton - variant inline - isFavorite false - hideInactive false - test", async () => {
      const result = mutationResultMock();
      useToggleFavoriteMock.mockReturnValue(result);

      const descriptor = dtestData.dPrompt();
      descriptor.isFavorite = false;

      const { container } = renderWithReactQuery(
         <AddToFavoriteButton
            descriptor={descriptor}
            variant="inline"
            hideInactive={false}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AddToFavoriteButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("AddToFavoriteButton - isFavorite false - button clicked - result.success true - test", async () => {
      const actionResult = {
         success: true,
         message: "Zu Favoriten hinzugefügt",
      };
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
      });

      const result = mutationResultMock(mutateFn);
      useToggleFavoriteMock.mockReturnValue(result);

      const descriptor = dtestData.dPrompt();
      descriptor.isFavorite = false;

      renderWithReactQuery(<AddToFavoriteButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const toggleBtn = screen.getByTestId("toggle-favorite-btn");
      await userEvent.click(toggleBtn);

      const expectedParams: UpdateIsFavoriteParams = {
         descriptorId: descriptor.id,
         isFavorite: true,
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onError: expect.any(Function),
      });

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
      });
   });

   it("AddToFavoriteButton - isFavorite true - button clicked  - result.success true - test", async () => {
      const actionResult = {
         success: true,
         message: "Aus Favoriten entfernt",
      };

      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
      });

      const result = mutationResultMock(mutateFn);
      useToggleFavoriteMock.mockReturnValue(result);

      const descriptor = dtestData.dPrompt();
      descriptor.isFavorite = true;

      renderWithReactQuery(<AddToFavoriteButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const toggleBtn = screen.getByTestId("toggle-favorite-btn");
      await userEvent.click(toggleBtn);

      const expectedParams: UpdateIsFavoriteParams = {
         descriptorId: descriptor.id,
         isFavorite: false,
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onError: expect.any(Function),
      });

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
      });
   });

   it("AddToFavoriteButton - button clicked - result.success false - test", async () => {
      const actionResult = {
         success: false,
         message: "Fehler beim Hinzufügen zu Favoriten",
      };
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
      });

      const result = mutationResultMock(mutateFn);
      useToggleFavoriteMock.mockReturnValue(result);

      const descriptor = dtestData.dPrompt();
      descriptor.isFavorite = false;

      renderWithReactQuery(<AddToFavoriteButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const toggleBtn = screen.getByTestId("toggle-favorite-btn");
      await userEvent.click(toggleBtn);

      const expectedParams: UpdateIsFavoriteParams = {
         descriptorId: descriptor.id,
         isFavorite: true,
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onError: expect.any(Function),
      });

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
      });
   });

   it("AddToFavoriteButton - button clicked - onError - test", async () => {
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onError();
      });

      const result = mutationResultMock(mutateFn);
      useToggleFavoriteMock.mockReturnValue(result);

      const descriptor = dtestData.dPrompt();
      descriptor.isFavorite = false;

      renderWithReactQuery(<AddToFavoriteButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const toggleBtn = screen.getByTestId("toggle-favorite-btn");
      await userEvent.click(toggleBtn);

      const expectedParams: UpdateIsFavoriteParams = {
         descriptorId: descriptor.id,
         isFavorite: true,
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onError: expect.any(Function),
      });

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            "Fehler beim Aktualisieren der Favoriten"
         );
      });
   });
});
