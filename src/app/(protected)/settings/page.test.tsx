import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import SettingsPage, { metadata } from "./page";

export const expectedMetadata: Metadata = {
   title: "Einstellungen",
};

const assertRendered = () => {
   const page = screen.getByTestId("settings-page");
   const settings = screen.getByTestId("settings");

   assertInDocument(page);
   assertInDocument(settings);
};

describe("SettingsPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("SettingsPage rendered test", async () => {
      const { container } = await renderAsyncRSC(SettingsPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SettingsPage functionality tests", () => {
   it("SettingsPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
