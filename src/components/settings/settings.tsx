import { DSettingsSection } from "@/data/types/domain/settings";
import { DUser } from "@/data/types/domain/user";

import { GlobalPromptFields } from "./content";
import { Navigation } from "./navigation";
import { AccountSettings, GeneralSettings, Subscription } from "./user";

type Props = {
   user: DUser;
   section: DSettingsSection;
};

export const Settings = ({ user, section }: Props) => {
   const content = () => {
      if (section === "account") {
         return <AccountSettings />;
      }
      if (section === "subscription") {
         return <Subscription />;
      }
      if (section === "global-template-fields") {
         return <GlobalPromptFields />;
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
