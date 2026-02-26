-- CreateTable
CREATE TABLE "global_field" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "label" VARCHAR(250) NOT NULL,
    "description" VARCHAR(500),
    "type" "prompt_template_field_type" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "default_value" TEXT,
    "options" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "global_field_user_id_idx" ON "global_field"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "global_field_user_id_name_key" ON "global_field"("user_id", "name");

-- AddForeignKey
ALTER TABLE "global_field" ADD CONSTRAINT "global_field_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
