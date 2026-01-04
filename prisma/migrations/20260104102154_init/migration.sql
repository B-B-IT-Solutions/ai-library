-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('TEMPLATE', 'BUNDLE');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(250) NOT NULL DEFAULT 'NO_NAME',
    "email" VARCHAR(250) NOT NULL,
    "email_verified" TIMESTAMP(6),
    "image" TEXT,
    "password" VARCHAR(250),
    "role" VARCHAR(50) NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "user_id" UUID NOT NULL,
    "type" VARCHAR(250) NOT NULL,
    "provider" VARCHAR(500) NOT NULL,
    "provider_account_id" VARCHAR(500) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(250),
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("provider","provider_account_id")
);

-- CreateTable
CREATE TABLE "session" (
    "session_token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "expires" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("session_token")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_token_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "prompt_descriptor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(500) NOT NULL,
    "recommended_model" VARCHAR(250) NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt_descriptor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "prompt_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_template_descriptor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(250) NOT NULL,
    "description" VARCHAR(750) NOT NULL,
    "recommended_model" VARCHAR(250) NOT NULL,
    "prompt_template_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt_template_descriptor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_template" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "detailed_description" TEXT NOT NULL,
    "prompt_text" TEXT NOT NULL,

    CONSTRAINT "prompt_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_template_category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "prompt_template_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(250) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "discount_amount" DECIMAL(10,2),
    "type" "ProductType" NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_feature" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "icon" VARCHAR(50) NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" VARCHAR(750) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_use_case" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "category" VARCHAR(250) NOT NULL,
    "description" VARCHAR(750) NOT NULL,
    "tags" VARCHAR(100)[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_use_case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_example" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "content" VARCHAR(750) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_instruction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "step" INTEGER NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" VARCHAR(750) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_instruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "session_cart_id" VARCHAR(250),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cart_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "product_name" VARCHAR(250) NOT NULL,
    "product_description" VARCHAR(500),
    "product_type" "ProductType" NOT NULL,
    "product_price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "total_amount" DECIMAL(10,2) NOT NULL,
    "payment_method" VARCHAR(100),
    "stripe_checkout_session_id" VARCHAR(500),
    "stripe_payment_intent_id" VARCHAR(500),
    "stripe_payment_status" VARCHAR(50),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "product_name" VARCHAR(250) NOT NULL,
    "product_description" VARCHAR(500),
    "product_type" "ProductType" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_entry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "template_descriptor_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PromptCategoryToPromptDescriptor" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_PromptCategoryToPromptDescriptor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromptTemplateCategoryToPromptTemplateDescriptor" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_PromptTemplateCategoryToPromptTemplateDescriptor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_category_name_key" ON "prompt_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_template_descriptor_prompt_template_id_key" ON "prompt_template_descriptor"("prompt_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_template_category_name_key" ON "prompt_template_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_item_product_id_template_id_key" ON "product_item"("product_id", "template_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_session_cart_id_key" ON "cart"("session_cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_cart_id_product_id_key" ON "cart_item"("cart_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_stripe_checkout_session_id_key" ON "order"("stripe_checkout_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_entry_user_id_template_descriptor_id_key" ON "library_entry"("user_id", "template_descriptor_id");

-- CreateIndex
CREATE INDEX "_PromptCategoryToPromptDescriptor_B_index" ON "_PromptCategoryToPromptDescriptor"("B");

-- CreateIndex
CREATE INDEX "_PromptTemplateCategoryToPromptTemplateDescriptor_B_index" ON "_PromptTemplateCategoryToPromptTemplateDescriptor"("B");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt" ADD CONSTRAINT "prompt_id_fkey" FOREIGN KEY ("id") REFERENCES "prompt_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_template_descriptor" ADD CONSTRAINT "prompt_template_descriptor_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_feature" ADD CONSTRAINT "product_feature_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_use_case" ADD CONSTRAINT "product_use_case_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_example" ADD CONSTRAINT "product_example_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_instruction" ADD CONSTRAINT "product_instruction_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_item" ADD CONSTRAINT "product_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_item" ADD CONSTRAINT "product_item_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "prompt_template_descriptor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_template_descriptor_id_fkey" FOREIGN KEY ("template_descriptor_id") REFERENCES "prompt_template_descriptor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptCategoryToPromptDescriptor" ADD CONSTRAINT "_PromptCategoryToPromptDescriptor_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptCategoryToPromptDescriptor" ADD CONSTRAINT "_PromptCategoryToPromptDescriptor_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptTemplateCategoryToPromptTemplateDescriptor" ADD CONSTRAINT "_PromptTemplateCategoryToPromptTemplateDescriptor_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt_template_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptTemplateCategoryToPromptTemplateDescriptor" ADD CONSTRAINT "_PromptTemplateCategoryToPromptTemplateDescriptor_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt_template_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
