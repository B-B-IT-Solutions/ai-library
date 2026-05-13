/*
  Warnings:

  - Changed the type of `type` on the `catalog_entry_field` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `global_field` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `prompt_field` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "prompt_field_type" AS ENUM ('TEXT', 'TEXTAREA', 'EMAIL', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'RADIO');

-- AlterTable
ALTER TABLE "catalog_entry_field" DROP COLUMN "type",
ADD COLUMN     "type" "prompt_field_type" NOT NULL;

-- AlterTable
ALTER TABLE "global_field" DROP COLUMN "type",
ADD COLUMN     "type" "prompt_field_type" NOT NULL;

-- AlterTable
ALTER TABLE "prompt_field" DROP COLUMN "type",
ADD COLUMN     "type" "prompt_field_type" NOT NULL;

-- DropEnum
DROP TYPE "prompt_template_field_type";
