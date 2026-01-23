jest.mock("@/data/actions/user");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { updateProfile } from "@/data/actions/user";
import { ActionResult } from "@/data/types/utils";

import { UserProfile } from "./user-profile";

const mockUpdateProfile = updateProfile as jest.MockedFunction<
   typeof updateProfile
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
      mockUpdateProfile.mockResolvedValue(result);

      const user = dtestData.dUser();
      render(<UserProfile user={user} />);

      await waitFor(() => {
         assertRendered();
         expect(mockUpdateProfile).not.toHaveBeenCalled();
      });

      const input = screen.getByTestId("name-input");
      await userEvent.type(input, " updated 1");

      const expectedName = "name-1 updated 1";
      expect(input).toHaveValue(expectedName);
      expect(mockUpdateProfile).not.toHaveBeenCalled();

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
         expect(mockUpdateProfile).toHaveBeenCalledWith(expectedName);
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
      mockUpdateProfile.mockResolvedValue(result);

      const user = dtestData.dUser();
      render(<UserProfile user={user} />);

      await waitFor(() => {
         assertRendered();
         expect(mockUpdateProfile).not.toHaveBeenCalled();
      });

      const input = screen.getByTestId("name-input");
      await userEvent.type(input, " updated 123");

      const expectedName = "name-1 updated 123";
      expect(input).toHaveValue(expectedName);
      expect(mockUpdateProfile).not.toHaveBeenCalled();

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
         expect(mockUpdateProfile).toHaveBeenCalledWith(expectedName);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });
});
