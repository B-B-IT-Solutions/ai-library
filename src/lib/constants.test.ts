import {APP_DESCRIPTION, APP_NAME, SERVER_URL} from "./constants";

describe("Constants tests", () => {
  it("Constants test", async () => {
    expect(APP_NAME).toEqual("KI Bibliothek");
    expect(APP_DESCRIPTION).toEqual("Modernene KI-Bibliothek");
    expect(SERVER_URL).toEqual("http://localhost:3000");
  });
});
