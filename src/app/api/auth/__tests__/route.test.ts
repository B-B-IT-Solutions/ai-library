import { handlers } from "@/auth";
import { GET, POST } from "../[...nextauth]/route";

describe("handlers tests", () => {
   it("GET/POST test", () => {
      expect(GET).toBe(handlers.GET);
      expect(POST).toBe(handlers.POST);
   });
});
