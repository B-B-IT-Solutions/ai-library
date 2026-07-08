import { SURVEY_DATA } from "./survey-data";
import { SurveyContainer } from "./SurveyContainer";

export const SurveyMain = async () => {
   return (
      <div
         className="mx-auto w-full max-w-lg px-4 py-12"
         data-testid="survey-start"
      >
         <SurveyContainer data={SURVEY_DATA} />
      </div>
   );
};
