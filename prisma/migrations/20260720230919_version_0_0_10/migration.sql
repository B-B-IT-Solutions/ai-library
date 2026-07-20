-- AlterTable
ALTER TABLE "prompt" DROP COLUMN "recommended_model",
ADD COLUMN     "model_id" INTEGER;

-- CreateTable
CREATE TABLE "prompt_model" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "prompt_model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_model_user_id_idx" ON "prompt_model"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_model_user_id_name_key" ON "prompt_model"("user_id", "name");

-- AddForeignKey
ALTER TABLE "prompt" ADD CONSTRAINT "prompt_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "prompt_model"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_model" ADD CONSTRAINT "prompt_model_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
