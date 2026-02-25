-- DropForeignKey
ALTER TABLE "library_entry" DROP CONSTRAINT "library_entry_template_descriptor_id_fkey";

-- DropForeignKey
ALTER TABLE "library_entry" DROP CONSTRAINT "library_entry_user_id_fkey";

-- AlterTable
ALTER TABLE "library_entry" ADD COLUMN     "is_favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "library_collection" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "description" VARCHAR(750),
    "color" VARCHAR(50),
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_collection_entry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "collection_id" UUID NOT NULL,
    "entry_id" UUID NOT NULL,
    "added_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_collection_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "library_collection_user_id_idx" ON "library_collection"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_collection_user_id_name_key" ON "library_collection"("user_id", "name");

-- CreateIndex
CREATE INDEX "library_collection_entry_collection_id_idx" ON "library_collection_entry"("collection_id");

-- CreateIndex
CREATE INDEX "library_collection_entry_entry_id_idx" ON "library_collection_entry"("entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_collection_entry_collection_id_entry_id_key" ON "library_collection_entry"("collection_id", "entry_id");

-- CreateIndex
CREATE INDEX "library_entry_user_id_is_favorite_idx" ON "library_entry"("user_id", "is_favorite");

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_template_descriptor_id_fkey" FOREIGN KEY ("template_descriptor_id") REFERENCES "prompt_template_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_collection" ADD CONSTRAINT "library_collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_collection_entry" ADD CONSTRAINT "library_collection_entry_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "library_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_collection_entry" ADD CONSTRAINT "library_collection_entry_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "library_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
