import {
   APP_DESCRIPTION,
   APP_NAME,
   APP_URL,
   INIT_PAGE_NUMBER,
   PAGE_SIZE,
   STRIPE_SECRET_KEY,
} from "./constants";

describe("Constants tests", () => {
   it("Constants test", async () => {
      expect(APP_NAME).toEqual("KI Bibliothek");
      expect(APP_DESCRIPTION).toEqual("Modernene KI-Bibliothek");
      expect(APP_URL).toEqual("http://localhost:3000");
      expect(STRIPE_SECRET_KEY).toEqual(
         "sk_test_0o3d0b4S9CeARjPD9QnK3xgq96a7esuI4nxtLZEWNSk"
      );
      expect(INIT_PAGE_NUMBER).toEqual(0);
      expect(PAGE_SIZE).toEqual(10);
   });
});
