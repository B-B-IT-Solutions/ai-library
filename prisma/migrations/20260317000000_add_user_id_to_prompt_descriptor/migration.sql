-- AlterTable
ALTER TABLE "prompt_descriptor" ADD COLUMN "user_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "prompt_descriptor_user_id_idx" ON "prompt_descriptor"("user_id");

-- AddForeignKey
ALTER TABLE "prompt_descriptor" ADD CONSTRAINT "prompt_descriptor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
