-- CreateEnum
CREATE TYPE "catalog_entry_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "catalog_category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(250) NOT NULL,
    "slug" VARCHAR(250) NOT NULL,
    "description" VARCHAR(500),
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_entry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(250) NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" VARCHAR(750) NOT NULL,
    "recommended_model" VARCHAR(250) NOT NULL,
    "content" TEXT NOT NULL,
    "status" "catalog_entry_status" NOT NULL DEFAULT 'DRAFT',
    "category_id" UUID,
    "copy_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_entry_field" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "catalog_entry_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "label" VARCHAR(250) NOT NULL,
    "description" VARCHAR(500),
    "type" "prompt_template_field_type" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "default_value" TEXT,
    "options" JSONB,

    CONSTRAINT "catalog_entry_field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catalog_category_name_key" ON "catalog_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_category_slug_key" ON "catalog_category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_entry_slug_key" ON "catalog_entry"("slug");

-- CreateIndex
CREATE INDEX "catalog_entry_status_idx" ON "catalog_entry"("status");

-- CreateIndex
CREATE INDEX "catalog_entry_category_id_idx" ON "catalog_entry"("category_id");

-- CreateIndex
CREATE INDEX "catalog_entry_copy_count_idx" ON "catalog_entry"("copy_count");

-- CreateIndex
CREATE INDEX "catalog_entry_field_catalog_entry_id_idx" ON "catalog_entry_field"("catalog_entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_entry_field_catalog_entry_id_name_key" ON "catalog_entry_field"("catalog_entry_id", "name");

-- AddForeignKey
ALTER TABLE "catalog_entry" ADD CONSTRAINT "catalog_entry_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "catalog_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_entry_field" ADD CONSTRAINT "catalog_entry_field_catalog_entry_id_fkey" FOREIGN KEY ("catalog_entry_id") REFERENCES "catalog_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
