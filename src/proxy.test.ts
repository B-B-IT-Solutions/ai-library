import { assertStringifyEqual } from "@tests";

import { auth } from "@/auth";

import { proxy } from "./proxy";

describe("proxy tests", () => {
   it("proxy test", async () => {
      assertStringifyEqual(proxy, auth);
   });
});
