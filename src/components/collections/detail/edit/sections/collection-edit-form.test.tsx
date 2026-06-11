jest.mock("@/data/actions/collection");
jest.mock("sonner");

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   dtestData,
   typeIntoInput,
   typeIntoTextArea,
} from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { createCollection, updateCollection } from "@/data/actions/collection";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";
import { initCollection } from "../utils";

import { CollectionEditForm } from "./collection-edit-form";

const createCollectionMock = createCollection as jest.MockedFunction<
   typeof createCollection
>;
const updateCollectionMock = updateCollection as jest.MockedFunction<
   typeof updateCollection
>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   assertInDocument(screen.getByTestId("collection-edit-form"));
};

const assertFormRendered = () => {
   const name = screen.getByTestId("name");
   const description = screen.getByTestId("description");
   const color = screen.getByTestId("color");

   assertInDocument(name);
   assertInDocument(description);
   assertInDocument(color);
};

const submitForm = () => {
   fireEvent.submit(document.getElementById("collection-edit-form")!);
};

describe("CollectionEditForm rendering tests", () => {
   it("create mode - test", async () => {
      const { container } = render(<CollectionEditForm />);

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("edit mode - test", async () => {
      const collection = dtestData.dCollection(1);

      const { container } = render(
         <CollectionEditForm collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
      });

      expect(container).toMatchSnapshot();

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionEditForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("create mode - save btn clicked - success - test", async () => {
      const collection = dtestData.dCollection(2);
      const result: ActionResult<DCollection> = {
         success: true,
         message: "Sammlung erfolgreich erstellt",
         data: collection,
      };
      createCollectionMock.mockResolvedValue(result);

      render(<CollectionEditForm />);

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
         expect(createCollectionMock).not.toHaveBeenCalled();
      });

      submitForm();

      await waitFor(() => {
         expect(createCollectionMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", "Neue Sammlung");
      submitForm();

      const initValues = initCollection();
      const expectedPayload: DCollectionUpdate = {
         ...initValues,
         name: initValues.name + "Neue Sammlung",
      };

      await waitFor(() => {
         expect(createCollectionMock).toHaveBeenCalledTimes(1);
         expect(createCollectionMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual(`/collections/${collection.id}`);
      });
   });

   it("create mode - save btn clicked - failed - test", async () => {
      const result: ActionResult<DCollection> = {
         success: false,
         message: "Fehler beim Erstellen",
      };
      createCollectionMock.mockResolvedValue(result);

      render(<CollectionEditForm />);

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
         expect(createCollectionMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", "Neue Sammlung 123");
      submitForm();

      const initValues = initCollection();
      const expectedPayload: DCollectionUpdate = {
         ...initValues,
         name: initValues.name + "Neue Sammlung 123",
      };

      await waitFor(() => {
         expect(createCollectionMock).toHaveBeenCalledTimes(1);
         expect(createCollectionMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/");
      });
   });

   it("edit mode - save btn clicked - success - test", async () => {
      const collection = dtestData.dCollection(1);
      const result: ActionResult<DCollection> = {
         success: true,
         message: "Sammlung erfolgreich gespeichert",
         data: collection,
      };
      updateCollectionMock.mockResolvedValue(result);

      render(<CollectionEditForm collection={collection} />);

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
         expect(updateCollectionMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", " aktualisiert");
      await typeIntoTextArea("description", " neu");
      submitForm();

      const initValues = initCollection(collection);
      const expectedPayload: DCollectionUpdate = {
         ...initValues,
         name: initValues.name + " aktualisiert",
         description: initValues.description + " neu",
      };

      await waitFor(() => {
         expect(updateCollectionMock).toHaveBeenCalledTimes(1);
         expect(updateCollectionMock).toHaveBeenCalledWith(
            collection.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("edit mode - save btn clicked - failed - test", async () => {
      const collection = dtestData.dCollection(1);
      const result: ActionResult<DCollection> = {
         success: false,
         message: "Fehler beim Speichern",
         data: collection,
      };
      updateCollectionMock.mockResolvedValue(result);

      render(<CollectionEditForm collection={collection} />);

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
         expect(updateCollectionMock).not.toHaveBeenCalled();
      });

      submitForm();

      const initValues = initCollection(collection);
      const expectedPayload: DCollectionUpdate = {
         ...initValues,
      };

      await waitFor(() => {
         expect(updateCollectionMock).toHaveBeenCalledTimes(1);
         expect(updateCollectionMock).toHaveBeenCalledWith(
            collection.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });
});
