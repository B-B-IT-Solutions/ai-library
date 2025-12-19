import {
   APP_DESCRIPTION,
   APP_NAME,
   APP_URL,
   INIT_PAGE_NUMBER,
   PAGE_SIZE,
} from "./constants";

describe("Constants tests", () => {
   it("Constants test", async () => {
      expect(APP_NAME).toEqual("KI Bibliothek");
      expect(APP_DESCRIPTION).toEqual("Modernene KI-Bibliothek");
      expect(APP_URL).toEqual("http://localhost:3000");
      expect(INIT_PAGE_NUMBER).toEqual(0);
      expect(PAGE_SIZE).toEqual(10);
   });
});
