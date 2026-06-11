-- CreateEnum
CREATE TYPE "workflow_step_type" AS ENUM ('TEMPLATE_REF', 'STANDALONE');

-- CreateTable
CREATE TABLE "workflow" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" VARCHAR(750),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_step" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workflow_id" UUID NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "hint" VARCHAR(750),
    "type" "workflow_step_type" NOT NULL,
    "template_id" UUID,
    "content" TEXT,
    "is_start" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_step_edge" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "from_step_id" UUID NOT NULL,
    "to_step_id" UUID NOT NULL,
    "label" VARCHAR(250) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_step_edge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workflow_user_id_idx" ON "workflow"("user_id");

-- CreateIndex
CREATE INDEX "workflow_step_workflow_id_idx" ON "workflow_step"("workflow_id");

-- CreateIndex
CREATE INDEX "workflow_step_edge_from_step_id_idx" ON "workflow_step_edge"("from_step_id");

-- CreateIndex
CREATE INDEX "workflow_step_edge_to_step_id_idx" ON "workflow_step_edge"("to_step_id");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_step_edge_from_step_id_to_step_id_key" ON "workflow_step_edge"("from_step_id", "to_step_id");

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_step" ADD CONSTRAINT "workflow_step_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_step" ADD CONSTRAINT "workflow_step_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "prompt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_step_edge" ADD CONSTRAINT "workflow_step_edge_from_step_id_fkey" FOREIGN KEY ("from_step_id") REFERENCES "workflow_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_step_edge" ADD CONSTRAINT "workflow_step_edge_to_step_id_fkey" FOREIGN KEY ("to_step_id") REFERENCES "workflow_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;
