jest.mock("@/data/actions/library");

import { screen, waitFor } from "@testing-library/dom";
import {
   assertInDocument,
   AuthMockedFunction,
   dtestData,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getLibraryEntries } from "@/data/actions/library";

import { LibraryPage, metadata } from "./page";

const authMock = auth as unknown as AuthMockedFunction;
const getLibraryEntriesMock = getLibraryEntries as jest.MockedFunction<
   typeof getLibraryEntries
>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const expectedMetadata: Metadata = {
   title: "Meine Bibliothek",
};

const assertRendered = () => {
   const page = screen.getByTestId("library-page");
   const library = screen.getByTestId("library");

   assertInDocument(page);
   assertInDocument(library);
};

describe("LibraryPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryPage - session null - redirects to home", async () => {
      authMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(LibraryPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntriesMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryPage - session.user undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(LibraryPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntriesMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryPage - session.user.id undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(LibraryPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntriesMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryPage - library items empty - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);
      getLibraryEntriesMock.mockResolvedValue([]);

      const { container } = await renderAsyncRSC(LibraryPage, {});

      await waitFor(() => {
         assertRendered();
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntriesMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryPage - library items - test", async () => {
      const session = ntestData.session();
      const libraryEntries = dtestData.dLibraryEntries();
      authMock.mockResolvedValue(session);
      getLibraryEntriesMock.mockResolvedValue(libraryEntries);

      const { container } = await renderAsyncRSC(LibraryPage, {});

      await waitFor(() => {
         assertRendered();
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntriesMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryPage functionality tests", () => {
   it("LibraryPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
