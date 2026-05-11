jest.mock("@/data/actions/collection");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { setCollectionPublic } from "@/data/actions/collection";
import { DCollection } from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";

import { CollectionOther } from "./collection-other";

const setCollectionPublicMock = setCollectionPublic as jest.MockedFunction<
   typeof setCollectionPublic
>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   assertInDocument(screen.getByTestId("collection-other"));
   assertInDocument(screen.getByTestId("public-toggle"));
   assertInDocument(screen.getByTestId("public-toggle-btn"));
};

const assertUrlRendered = () => {
   assertInDocument(screen.getByTestId("public-url"));
   assertInDocument(screen.getByTestId("copy-url-btn"));
};

const assertUrlNotRendered = () => {
   assertNotInDocument(screen.queryByTestId("public-url"));
   assertNotInDocument(screen.queryByTestId("copy-url-btn"));
};

describe("CollectionOther rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("private collection - test", async () => {
      const collection = dtestData.dCollection();
      collection.isPublic = false;

      const { container } = render(<CollectionOther collection={collection} />);

      await waitFor(() => {
         assertRendered();
         assertUrlNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("public collection - test", async () => {
      const collection = dtestData.dCollection();
      collection.isPublic = true;

      const { container } = render(<CollectionOther collection={collection} />);

      await waitFor(() => {
         assertRendered();
         assertUrlRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionOther toggle tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("toggle public clicked - private collection - success - test", async () => {
      const collection = dtestData.dCollection();
      collection.isPublic = false;

      const result: ActionResult<DCollection> = {
         success: true,
         message: "Jetzt öffentlich",
         data: collection,
      };
      setCollectionPublicMock.mockResolvedValue(result);

      render(<CollectionOther collection={collection} />);

      const toggleBtn = screen.getByTestId("public-toggle-btn");
      await userEvent.click(toggleBtn);

      await waitFor(() => {
         expect(setCollectionPublicMock).toHaveBeenCalledTimes(1);
         expect(setCollectionPublicMock).toHaveBeenCalledWith(
            collection.id,
            true
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("toggle public clicked - public collection - success - test", async () => {
      const collection = dtestData.dCollection();
      collection.isPublic = true;

      const result: ActionResult<DCollection> = {
         success: true,
         message: "Jetzt privat",
         data: collection,
      };
      setCollectionPublicMock.mockResolvedValue(result);

      render(<CollectionOther collection={collection} />);

      const toggleBtn = screen.getByTestId("public-toggle-btn");
      await userEvent.click(toggleBtn);

      await waitFor(() => {
         expect(setCollectionPublicMock).toHaveBeenCalledTimes(1);
         expect(setCollectionPublicMock).toHaveBeenCalledWith(
            collection.id,
            false
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("toggle public clicked - private collection - failed - test", async () => {
      const collection = dtestData.dCollection();
      collection.isPublic = false;

      const result: ActionResult<DCollection> = {
         success: false,
         message: "Sammlung ist jetzt öffentlich zugänglich",
      };
      setCollectionPublicMock.mockResolvedValue(result);

      render(<CollectionOther collection={collection} />);

      const toggleBtn = screen.getByTestId("public-toggle-btn");
      await userEvent.click(toggleBtn);

      await waitFor(() => {
         expect(setCollectionPublicMock).toHaveBeenCalledTimes(1);
         expect(setCollectionPublicMock).toHaveBeenCalledWith(
            collection.id,
            true
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });
});
