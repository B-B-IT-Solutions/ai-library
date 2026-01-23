jest.mock("@/data/repositories/user");

import { ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { UserRepository } from "@/data/repositories/user";
import { DUserSignUp } from "@/data/types/domain/user";
import { UserCreateInput } from "@/generated/prisma/models";
import { hash } from "@/lib/encrypt";

import { toDUser } from "./user.mapper";
import { UserService } from "./user.service";

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
