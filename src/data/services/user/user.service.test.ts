jest.mock("@/data/repositories/user");
jest.mock("@/lib/encrypt");

import { ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { UserRepository } from "@/data/repositories/user";
import { DUserSignIn, DUserSignUp } from "@/data/types/domain/user";
import { UserCreateInput } from "@/generated/prisma/models";
import { compare, hash } from "@/lib/encrypt";

import { toDUser } from "./user.mapper";
import { UserService } from "./user.service";

const compareMock = compare as jest.MockedFunction<typeof compare>;

const userRepo = new UserRepository(prisma);
const userRepoMock = userRepo as DeepMockProxy<UserRepository>;

const userService = new UserService(userRepoMock);

describe("signUpUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("signUpUser - user created - test", async () => {
      const createdUser = ptestData.pUser();
      userRepoMock.pCreateUser.mockResolvedValue(createdUser);

      const data: DUserSignUp = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
      };

      const result = await userService.signUpUser(data);

      const expectedResult = toDUser(createdUser);

      const newUser: UserCreateInput = {
         name: data.name,
         email: data.email,
         password: await hash(data.password),
      };

      expect(result).toEqual(expectedResult);
      expect(userRepoMock.pCreateUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pCreateUser).toHaveBeenCalledWith(newUser);
   });
});

describe("singInUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("singInUser - user null - test", async () => {
      userRepoMock.pGetUserByEmail.mockResolvedValue(null);

      const data: DUserSignIn = {
         email: "test@example.com",
         password: "password123",
      };

      const result = await userService.singInUser(data);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(data.email);
   });

   it("singInUser - user.password is null - test", async () => {
      const user = ptestData.pUser();
      user.password = null;
      userRepoMock.pGetUserByEmail.mockResolvedValue(user);

      const data: DUserSignIn = {
         email: "test@example.com",
         password: "password123",
      };

      const result = await userService.singInUser(data);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(data.email);
   });

   it("singInUser - user.password compare false - test", async () => {
      const user = ptestData.pUser();
      userRepoMock.pGetUserByEmail.mockResolvedValue(user);
      compareMock.mockResolvedValue(false);

      const data: DUserSignIn = {
         email: "test@example.com",
         password: "password123",
      };

      const result = await userService.singInUser(data);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(data.email);
      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledWith(data.password, user.password);
   });

   it("singInUser - user.password compare true - test", async () => {
      const user = ptestData.pUser();
      userRepoMock.pGetUserByEmail.mockResolvedValue(user);
      compareMock.mockResolvedValue(true);

      const data: DUserSignIn = {
         email: "test@example.com",
         password: "password123",
      };

      const result = await userService.singInUser(data);

      const expectedResult = {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
      };

      expect(result).toEqual(expectedResult);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(data.email);
      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledWith(data.password, user.password);
   });
});
