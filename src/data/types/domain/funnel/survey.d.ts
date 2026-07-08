export type DSurveySegment = "solo" | "employee" | "coach" | "default";

export type DSurveySegments = Record<DSurveySegment, string>;

export type DSurveyData = Record<DSurveySegment, DSurveyQuestion[]>;

export type DSurveyDimension =
   | "freq"
   | "prompting"
   | "tooling"
   | "files"
   | "automation"
   | "integration"
   | "quality"
   | "timesaving";

export type DSurveyScore = 1 | 2 | 3 | 4;

export type DSurveyAnswers = Record<DSurveyDimension, DSurveyScore>;

export type DSurveyAnswerOption = {
   score: DSurveyScore;
   label: string;
};

export type DSurveyQuestion = {
   id: DSurveyDimension;
   text: string;
   answers: [
      DSurveyAnswerOption,
      DSurveyAnswerOption,
      DSurveyAnswerOption,
      DSurveyAnswerOption,
   ];
};

export type SurveyData = Record<DSurveySegment, DSurveyQuestion[]>;

export type DSubmitSurveyInput = {
   email: string;
   firstName?: string;
   segment: DSurveySegment;
   answers: DSurveyAnswers;
};

export type DSurveyResult = {
   stage: 1 | 2 | 3 | 4;
   total: number;
   levers: [DSurveyDimension, DSurveyDimension];
   stageLabel: string;
   stageEmoji: string;
   stageText: string;
   ctaText: string;
   ctaHref: string;
   leverTexts: [string, string];
};
