/*
  Warnings:

  - A unique constraint covering the columns `[edge_id]` on the table `workflow_step` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "workflow_step_edge" DROP CONSTRAINT "workflow_step_edge_to_step_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "workflow_step_edge_id_key" ON "workflow_step"("edge_id");

-- AddForeignKey
ALTER TABLE "workflow_step_edge" ADD CONSTRAINT "workflow_step_edge_to_step_id_fkey" FOREIGN KEY ("to_step_id") REFERENCES "workflow_step"("edge_id") ON DELETE CASCADE ON UPDATE CASCADE;
