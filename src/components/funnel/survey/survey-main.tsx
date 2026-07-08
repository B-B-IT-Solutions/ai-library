import { getSurveySegments } from "@/data/actions/funnel/survey";

import { SurveyContainer } from "./SurveyContainer";

export const SurveyMain = async () => {
   const [segments] = await Promise.all([getSurveySegments()]);
   return (
      <div
         className="mx-auto w-full max-w-lg px-4 py-12"
         data-testid="survey-start"
      >
         <SurveyContainer segments={segments} />
      </div>
   );
};
