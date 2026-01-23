import { FC } from "react";

import { DUser } from "@/data/types/domain/user";

import { AppearanceSection } from "./appearance";
import { SecuritySection } from "./security";
import { ProfileSection } from "./user-profile";

type GeneralSettingsProps = {
   user: DUser;
};

export const GeneralSettings: FC<GeneralSettingsProps> = ({ user }) => {
   return (
      <div className="flex-col space-y-6" data-testid="general-settings">
         <ProfileSection user={user} />
         <SecuritySection />
         <AppearanceSection />
      </div>
   );
};
