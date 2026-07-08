import { getSurveyQuestions, getSurveySegments } from "@/data/actions/funnel/survey";
import { DSurveyQuestion, DSurveySegment } from "@/data/types/domain/funnel/survey";

import { SurveyContainer } from "./SurveyContainer";

export const SurveyMain = async () => {
   const segments = await getSurveySegments();
   const segmentKeys = Object.keys(segments) as DSurveySegment[];

   const questionsBySegment = Object.fromEntries(
      await Promise.all(
         segmentKeys.map(
            async (segment) =>
               [segment, await getSurveyQuestions(segment)] as const
         )
      )
   ) as Record<DSurveySegment, DSurveyQuestion[]>;

   return (
      <div
         className="mx-auto w-full max-w-lg px-4 py-12"
         data-testid="survey-start"
      >
         <SurveyContainer
            segments={segments}
            questionsBySegment={questionsBySegment}
         />
      </div>
   );
};
