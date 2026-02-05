import { AuthMockedFunction, ntestData } from "@tests";

import { auth } from "@/auth";
import { LoginUser } from "../types/next-auth";

import { isAuthenticated, requireUser } from "./auth-utils";

const authMock = auth as unknown as AuthMockedFunction;

describe("requireUser tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("requireUser - session null - test", async () => {
      authMock.mockResolvedValue(null);
      const fn = async () => requireUser();
      expect(fn).rejects.toThrow(Error);
   });

   it("requireUser - session.user undefined - test", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const fn = () => requireUser();
      expect(fn).rejects.toThrow(Error);
   });

   it("requireUser - session.user.id undefined - test", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const fn = () => requireUser();
      expect(fn).rejects.toThrow(Error);
   });

   it("requireUser - session.user.id defined - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const user = await requireUser();
      const expectedUser: LoginUser = {
         id: session.user.id!,
         name: session.user.name,
         email: session.user.email,
      };
      expect(user).toEqual(expectedUser);
   });
});

describe("isAuthenticated tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("isAuthenticated - session null - test", async () => {
      authMock.mockResolvedValue(null);
      const result = await isAuthenticated();
      expect(result).toBe(false);
   });

   it("isAuthenticated - session.user undefined - test", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const result = await isAuthenticated();
      expect(result).toBe(false);
   });

   it("isAuthenticated - session.user.id undefined - test", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const result = await isAuthenticated();
      expect(result).toBe(false);
   });

   it("isAuthenticated - session.user.id defined - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const result = await isAuthenticated();
      expect(result).toBe(true);
   });
});
