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
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { getLibraryEntry } from "@/data/actions/library";

import {
   LibraryEntryPage,
   LibraryEntryPageParams,
   LibraryEntryPageProps,
   metadata,
} from "./page";

const authMock = auth as unknown as AuthMockedFunction;
const getLibraryEntryMock = getLibraryEntry as jest.MockedFunction<
   typeof getLibraryEntry
>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;
const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

export const expectedMetadata: Metadata = {
   title: "Vorlage",
};

const assertRendered = () => {
   const page = screen.getByTestId("library-entry-page");
   const libraryEntry = screen.getByTestId("library-entry-details");

   assertInDocument(page);
   assertInDocument(libraryEntry);
};

describe("LibraryEntryPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryEntryPage - session null - redirects to home", async () => {
      authMock.mockResolvedValue(null);

      const params: LibraryEntryPageParams = { id: "entry-id-1" };
      const props: LibraryEntryPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(LibraryEntryPage, props);

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntryMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryPage - session.user undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const params: LibraryEntryPageParams = { id: "entry-id-1" };
      const props: LibraryEntryPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(LibraryEntryPage, props);

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntryMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryPage - session.user.id undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const params: LibraryEntryPageParams = { id: "entry-id-1" };
      const props: LibraryEntryPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(LibraryEntryPage, props);

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntryMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryPage - library entry null - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);
      getLibraryEntryMock.mockResolvedValue(null);

      const params: LibraryEntryPageParams = { id: "entry-id-1" };
      const props: LibraryEntryPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(LibraryEntryPage, props);

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntryMock).toHaveBeenCalledTimes(1);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryPage - library entry defined - test", async () => {
      const session = ntestData.session();
      const libraryEntry = dtestData.dLibraryEntryWithPromptTemplate();
      authMock.mockResolvedValue(session);
      getLibraryEntryMock.mockResolvedValue(libraryEntry);

      const params: LibraryEntryPageParams = { id: "entry-id-1" };
      const props: LibraryEntryPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(LibraryEntryPage, props);

      await waitFor(() => {
         assertRendered();
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntryMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryEntryPage functionality tests", () => {
   it("LibraryEntryPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
