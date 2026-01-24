import { FC } from "react";

import { DUser } from "@/data/types/domain/user";

import { UpdatePassword } from "./update-password";
import { UserProfile } from "./user-profile";

type GeneralSettingsProps = {
   user: DUser;
};

export const GeneralSettings: FC<GeneralSettingsProps> = ({ user }) => {
   return (
      <div className="flex-col space-y-6" data-testid="general-settings">
         <UserProfile user={user} />
         <UpdatePassword />
      </div>
   );
};
