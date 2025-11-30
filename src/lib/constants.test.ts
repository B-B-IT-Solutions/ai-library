import {
   APP_DESCRIPTION,
   APP_NAME,
   INIT_PAGE_NUMBER,
   PAGE_SIZE,
   SERVER_URL,
} from "./constants";

describe("Constants tests", () => {
   it("Constants test", async () => {
      expect(APP_NAME).toEqual("KI Bibliothek");
      expect(APP_DESCRIPTION).toEqual("Modernene KI-Bibliothek");
      expect(SERVER_URL).toEqual("http://localhost:3000");
      expect(INIT_PAGE_NUMBER).toEqual(0);
      expect(PAGE_SIZE).toEqual(10);
   });
});
