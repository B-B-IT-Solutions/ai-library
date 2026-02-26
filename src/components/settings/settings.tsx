import { FC } from "react";

import { DSettingsSection } from "@/data/types/domain/settings";
import { DUser } from "@/data/types/domain/user";

import { AccountSettings } from "./account";
import { GeneralSettings } from "./general";
import { Navigation } from "./navigation";
import { Subscription } from "./subscription";
import { TemplateFields } from "./template-fields";

type SettingsProps = {
   user: DUser;
   section: DSettingsSection;
};

export const Settings: FC<SettingsProps> = ({ user, section }) => {
   const content = () => {
      if (section === "account") {
         return <AccountSettings />;
      }
      if (section === "subscription") {
         return <Subscription />;
      }
      if (section === "template-fields") {
         return <TemplateFields />;
      }
      return <GeneralSettings user={user} />;
   };

   return (
      <div
         className="grid grid-cols-1 gap-8 lg:grid-cols-12"
         data-testid="settings-view"
      >
         <Navigation active={section} />
         <main className="lg:col-span-9">{content()}</main>
      </div>
   );
};
