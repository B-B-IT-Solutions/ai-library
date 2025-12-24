import { Settings } from "./settings";

export const metadata = {
   title: "Settings",
};

const SettingsPage = async () => {
   return (
      <div data-testid="settings-page">
         <Settings />
      </div>
   );
};

export default SettingsPage;
