/*
  Warnings:

  - You are about to drop the `library` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "library" DROP CONSTRAINT "library_order_id_fkey";

-- DropForeignKey
ALTER TABLE "library" DROP CONSTRAINT "library_product_id_fkey";

-- DropForeignKey
ALTER TABLE "library" DROP CONSTRAINT "library_template_id_fkey";

-- DropForeignKey
ALTER TABLE "library" DROP CONSTRAINT "library_user_id_fkey";

-- DropTable
DROP TABLE "library";

-- CreateTable
CREATE TABLE "library_entry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "library_entry_user_id_template_id_key" ON "library_entry"("user_id", "template_id");

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "prompt_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
