/*
  Warnings:

  - You are about to drop the `prompt0` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "prompt0" DROP CONSTRAINT "prompt0_id_fkey";

-- DropTable
DROP TABLE "prompt0";

-- CreateTable
CREATE TABLE "prompt0_content" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "prompt0_content_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prompt0_content" ADD CONSTRAINT "prompt0_content_id_fkey" FOREIGN KEY ("id") REFERENCES "prompt_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
