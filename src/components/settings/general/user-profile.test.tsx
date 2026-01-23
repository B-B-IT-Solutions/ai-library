jest.mock("@/data/actions/user");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { updateUserProfile } from "@/data/actions/user";
import { DUserUpdateData } from "@/data/types/domain/user";
import { ActionResult } from "@/data/types/utils";

import { UserProfile } from "./user-profile";

const updateUserProfileMock = updateUserProfile as jest.MockedFunction<
   typeof updateUserProfile
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const profile = screen.getByTestId("user-profile");
   const name = screen.getByTestId("name");
   const email = screen.getByTestId("email");
   const submitBtn = screen.getByTestId("submit-btn");

   assertInDocument(profile);
   assertInDocument(name);
   assertInDocument(email);
   assertInDocument(submitBtn);
};

describe("UserProfile rendering tests", () => {
   it("UserProfile rendered test", async () => {
      const user = dtestData.dUser();
      const { container } = render(<UserProfile user={user} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UserProfile functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("UserProfile - name updated - success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Profile updated",
      };
      updateUserProfileMock.mockResolvedValue(result);

      const user = dtestData.dUser();
      render(<UserProfile user={user} />);

      await waitFor(() => {
         assertRendered();
         expect(updateUserProfileMock).not.toHaveBeenCalled();
      });

      const input = screen.getByTestId("name-input");
      await userEvent.type(input, " updated 1");

      const name = "name-1 updated 1";
      expect(input).toHaveValue(name);
      expect(updateUserProfileMock).not.toHaveBeenCalled();

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectPayload: DUserUpdateData = { name };
      await waitFor(() => {
         expect(updateUserProfileMock).toHaveBeenCalledTimes(1);
         expect(updateUserProfileMock).toHaveBeenCalledWith(
            user.id,
            expectPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("UserProfile - name updated - success false - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Profile couldn't be updated",
      };
      updateUserProfileMock.mockResolvedValue(result);

      const user = dtestData.dUser();
      render(<UserProfile user={user} />);

      await waitFor(() => {
         assertRendered();
         expect(updateUserProfileMock).not.toHaveBeenCalled();
      });

      const input = screen.getByTestId("name-input");
      await userEvent.type(input, " updated 123");

      const name = "name-1 updated 123";
      expect(input).toHaveValue(name);
      expect(updateUserProfileMock).not.toHaveBeenCalled();

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectPayload: DUserUpdateData = { name };

      await waitFor(() => {
         expect(updateUserProfileMock).toHaveBeenCalledTimes(1);
         expect(updateUserProfileMock).toHaveBeenCalledWith(
            user.id,
            expectPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });
});
