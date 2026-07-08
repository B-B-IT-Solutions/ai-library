export { SurveyService } from "./survey.service";
export type { SubmitSurveyInput, SurveyResult } from "./survey.service";
export type {
   Segment,
   Dimension,
   Score,
   SurveyAnswers,
   AnswerOption,
   Question,
   SurveyData,
} from "./survey-data";
export { SEGMENT_LABELS, SURVEY_DATA } from "./survey-data";
export { calculateStage, calculateLevers } from "./survey-scoring";
export type { StageResult } from "./survey-results";
export { STAGE_RESULTS, LEVER_TEXTS } from "./survey-results";
