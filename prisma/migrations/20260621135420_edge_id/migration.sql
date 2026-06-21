/*
  Warnings:

  - You are about to drop the column `from_step_id` on the `workflow_step_edge` table. All the data in the column will be lost.
  - You are about to drop the column `to_step_id` on the `workflow_step_edge` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[from_step_edge_id,to_step_edge_id]` on the table `workflow_step_edge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `from_step_edge_id` to the `workflow_step_edge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_step_edge_id` to the `workflow_step_edge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "workflow_step_edge" DROP CONSTRAINT "workflow_step_edge_from_step_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_step_edge" DROP CONSTRAINT "workflow_step_edge_to_step_id_fkey";

-- DropIndex
DROP INDEX "workflow_step_edge_from_step_id_idx";

-- DropIndex
DROP INDEX "workflow_step_edge_from_step_id_to_step_id_key";

-- DropIndex
DROP INDEX "workflow_step_edge_to_step_id_idx";

-- AlterTable
ALTER TABLE "workflow_step_edge" DROP COLUMN "from_step_id",
DROP COLUMN "to_step_id",
ADD COLUMN     "from_step_edge_id" UUID NOT NULL,
ADD COLUMN     "to_step_edge_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "workflow_step_edge_from_step_edge_id_idx" ON "workflow_step_edge"("from_step_edge_id");

-- CreateIndex
CREATE INDEX "workflow_step_edge_to_step_edge_id_idx" ON "workflow_step_edge"("to_step_edge_id");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_step_edge_from_step_edge_id_to_step_edge_id_key" ON "workflow_step_edge"("from_step_edge_id", "to_step_edge_id");

-- AddForeignKey
ALTER TABLE "workflow_step_edge" ADD CONSTRAINT "workflow_step_edge_from_step_edge_id_fkey" FOREIGN KEY ("from_step_edge_id") REFERENCES "workflow_step"("edge_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_step_edge" ADD CONSTRAINT "workflow_step_edge_to_step_edge_id_fkey" FOREIGN KEY ("to_step_edge_id") REFERENCES "workflow_step"("edge_id") ON DELETE CASCADE ON UPDATE CASCADE;
