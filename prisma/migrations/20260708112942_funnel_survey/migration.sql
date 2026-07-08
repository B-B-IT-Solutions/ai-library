-- CreateTable
CREATE TABLE "survey_submission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(250) NOT NULL,
    "first_name" VARCHAR(250),
    "segment" VARCHAR(50) NOT NULL,
    "answers" JSONB NOT NULL,
    "total" INTEGER NOT NULL,
    "stage" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_submission_pkey" PRIMARY KEY ("id")
);
