jest.mock("@/auth");
jest.mock("@/data/db/queries/cart");
jest.mock("@/data/actions/auth-utils");

import { AuthMockedFunction, dtestData, ntestData, ptestData } from "@tests";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { pGetOrCreateCart } from "@/data/db/queries/cart";

import { getCart } from "./cart.actions";
import { toDCart } from "./cart.mapper";

const authMock = auth as unknown as AuthMockedFunction;
const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;

const pGetOrCreateCartMock = pGetOrCreateCart as jest.MockedFunction<
   typeof pGetOrCreateCart
>;

describe("getCart tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getCart - session null - sessionCartId null - test", async () => {
      authMock.mockResolvedValue(null);
      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);

      const result = await getCart();

      expect(result).toBeNull();
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith({});
   });

   it("getCart - session.user undefined- sessionCartId defined - test", async () => {
      const session = ntestData.session();
      session.user = undefined;
      const cart = ptestData.pCartWithItems();
      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);

      const cookies = { sessionCartId: "sessionCartId-1" };
      const reqCookies = ntestData.cookies(cookies);
      cookiesMock.mockResolvedValue(reqCookies);

      const result = await getCart();
      const expectResult = toDCart(cart);

      const expectedParams = { sessionCartId: cookies.sessionCartId };

      expect(result).toEqual(expectResult);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith(expectedParams);
   });

   //    it("getCart - session defined - test", async () => {
   //       authMock.mockResolvedValue(null);

   //       const user = dtestData.dLoginUser();
   //       const cart = ptestData.pCartWithItems();
   //       requireUserMock.mockResolvedValue(user);

   //       const cartId = "cart-1";

   //       await getCart();

   //       await waitFor(() => {
   //          expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
   //          expect(pGetOrCreateCartMock).toHaveBeenCalledWith(1);
   //       });
   //    });
});
