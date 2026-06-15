/*
  Warnings:

  - Added the required column `edge_id` to the `workflow_step` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workflow_step" ADD COLUMN     "edge_id" UUID NOT NULL;
