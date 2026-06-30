import { AuthMockedFunction, ntestData } from "@tests";

import { auth } from "@/auth";
import { LoginUser } from "../types/next-auth";

import { isAuthenticated, requireAdmin, requireUser } from "./auth-utils";

const authMock = auth as unknown as AuthMockedFunction;

describe("requireAdmin tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("session null - test", async () => {
      authMock.mockResolvedValue(null);
      const fn = async () => requireAdmin();
      expect(fn).rejects.toThrow(Error);
   });

   it("session.user undefined - test", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const fn = () => requireAdmin();
      expect(fn).rejects.toThrow(Error);
   });

   it("session.user.id undefined - test", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const fn = () => requireAdmin();
      expect(fn).rejects.toThrow(Error);
   });

   it("session.user.id defined - role user - test", async () => {
      const session = ntestData.session();
      session.user.role = "user";
      authMock.mockResolvedValue(session);

      const fn = () => requireAdmin();
      expect(fn).rejects.toThrow(Error);
   });

   it("session.user.id defined - role admin - test", async () => {
      const session = ntestData.session();
      session.user.role = "admin";
      authMock.mockResolvedValue(session);

      const user = await requireAdmin();
      const expectedUser: LoginUser = {
         id: session.user.id!,
         name: session.user.name,
         email: session.user.email,
      };
      expect(user).toEqual(expectedUser);
   });
});

describe("requireUser tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("session null - test", async () => {
      authMock.mockResolvedValue(null);
      const fn = async () => requireUser();
      expect(fn).rejects.toThrow(Error);
   });

   it("session.user undefined - test", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const fn = () => requireUser();
      expect(fn).rejects.toThrow(Error);
   });

   it("session.user.id undefined - test", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const fn = () => requireUser();
      expect(fn).rejects.toThrow(Error);
   });

   it("session.user.id defined - test", async () => {
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

   it("session null - test", async () => {
      authMock.mockResolvedValue(null);
      const result = await isAuthenticated();
      expect(result).toBe(false);
   });

   it("session.user undefined - test", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const result = await isAuthenticated();
      expect(result).toBe(false);
   });

   it("session.user.id undefined - test", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const result = await isAuthenticated();
      expect(result).toBe(false);
   });

   it("session.user.id defined - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const result = await isAuthenticated();
      expect(result).toBe(true);
   });
});
