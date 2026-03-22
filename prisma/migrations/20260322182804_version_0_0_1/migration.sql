-- CreateEnum
CREATE TYPE "prompt_template_field_type" AS ENUM ('TEXT', 'TEXTAREA', 'EMAIL', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'RADIO');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('TEMPLATE', 'BUNDLE');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'BASIC', 'PRO');

-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'INCOMPLETE', 'PAST_DUE', 'UNPAID', 'TRIALING', 'PAUSED');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(250) NOT NULL DEFAULT 'NO_NAME',
    "email" VARCHAR(250) NOT NULL,
    "email_verified" TIMESTAMP(6),
    "image" TEXT,
    "password" VARCHAR(250),
    "role" VARCHAR(50) NOT NULL DEFAULT 'user',
    "stripe_customer_id" VARCHAR(250),
    "legal_notices_accepted_at" TIMESTAMP(6),
    "iubenda_legal_notices_synced" BOOLEAN NOT NULL DEFAULT false,
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
    "user_id" UUID NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "content" TEXT NOT NULL,
    "recommended_model" VARCHAR(250) NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "current_version" INTEGER NOT NULL DEFAULT 0,
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
    "user_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "prompt_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_version" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_follow_up" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_follow_up_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_template_descriptor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
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
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_template_global_field" (
    "prompt_template_id" UUID NOT NULL,
    "global_field_id" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "prompt_template_global_field_pkey" PRIMARY KEY ("prompt_template_id","global_field_id")
);

-- CreateTable
CREATE TABLE "prompt_template_field" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_template_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "label" VARCHAR(250) NOT NULL,
    "description" VARCHAR(500),
    "type" "prompt_template_field_type" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "default_value" TEXT,
    "options" JSONB,

    CONSTRAINT "prompt_template_field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_template_category" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "prompt_template_category_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "library_entry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "template_descriptor_id" UUID NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_entry_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "subscription_plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tier" "SubscriptionTier" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "monthly_price" DECIMAL(10,2) NOT NULL,
    "yearly_price" DECIMAL(10,2) NOT NULL,
    "stripe_price_id_monthly" VARCHAR(250),
    "stripe_price_id_yearly" VARCHAR(250),
    "stripe_product_id" VARCHAR(250),
    "features" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "billing_interval" "BillingInterval" NOT NULL,
    "stripe_subscription_id" VARCHAR(250),
    "stripe_customer_id" VARCHAR(250),
    "stripe_checkout_session_id" VARCHAR(250),
    "current_period_start" TIMESTAMP(6),
    "current_period_end" TIMESTAMP(6),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "canceled_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "from_tier" "SubscriptionTier",
    "to_tier" "SubscriptionTier",
    "from_status" "SubscriptionStatus",
    "to_status" "SubscriptionStatus",
    "stripe_event_id" VARCHAR(250),
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_history_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "user_stripe_customer_id_key" ON "user"("stripe_customer_id");

-- CreateIndex
CREATE INDEX "prompt_descriptor_user_id_idx" ON "prompt_descriptor"("user_id");

-- CreateIndex
CREATE INDEX "prompt_category_user_id_idx" ON "prompt_category"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_category_user_id_name_key" ON "prompt_category"("user_id", "name");

-- CreateIndex
CREATE INDEX "prompt_version_prompt_id_idx" ON "prompt_version"("prompt_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_version_prompt_id_version_key" ON "prompt_version"("prompt_id", "version");

-- CreateIndex
CREATE INDEX "prompt_follow_up_prompt_id_idx" ON "prompt_follow_up"("prompt_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_template_descriptor_prompt_template_id_key" ON "prompt_template_descriptor"("prompt_template_id");

-- CreateIndex
CREATE INDEX "prompt_template_descriptor_user_id_idx" ON "prompt_template_descriptor"("user_id");

-- CreateIndex
CREATE INDEX "prompt_template_global_field_prompt_template_id_idx" ON "prompt_template_global_field"("prompt_template_id");

-- CreateIndex
CREATE INDEX "prompt_template_field_prompt_template_id_idx" ON "prompt_template_field"("prompt_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_template_field_prompt_template_id_name_key" ON "prompt_template_field"("prompt_template_id", "name");

-- CreateIndex
CREATE INDEX "prompt_template_category_user_id_idx" ON "prompt_template_category"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_template_category_user_id_name_key" ON "prompt_template_category"("user_id", "name");

-- CreateIndex
CREATE INDEX "global_field_user_id_idx" ON "global_field"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "global_field_user_id_name_key" ON "global_field"("user_id", "name");

-- CreateIndex
CREATE INDEX "library_entry_user_id_is_favorite_idx" ON "library_entry"("user_id", "is_favorite");

-- CreateIndex
CREATE UNIQUE INDEX "library_entry_user_id_template_descriptor_id_key" ON "library_entry"("user_id", "template_descriptor_id");

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
CREATE UNIQUE INDEX "product_item_product_id_template_id_key" ON "product_item"("product_id", "template_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_session_cart_id_key" ON "cart"("session_cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_cart_id_product_id_key" ON "cart_item"("cart_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_stripe_checkout_session_id_key" ON "order"("stripe_checkout_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_tier_key" ON "subscription_plan"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_user_id_key" ON "subscription"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripe_subscription_id_key" ON "subscription"("stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripe_checkout_session_id_key" ON "subscription"("stripe_checkout_session_id");

-- CreateIndex
CREATE INDEX "subscription_stripe_subscription_id_idx" ON "subscription"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "subscription_stripe_checkout_session_id_idx" ON "subscription"("stripe_checkout_session_id");

-- CreateIndex
CREATE INDEX "subscription_history_user_id_idx" ON "subscription_history"("user_id");

-- CreateIndex
CREATE INDEX "subscription_history_stripe_event_id_idx" ON "subscription_history"("stripe_event_id");

-- CreateIndex
CREATE INDEX "_PromptCategoryToPromptDescriptor_B_index" ON "_PromptCategoryToPromptDescriptor"("B");

-- CreateIndex
CREATE INDEX "_PromptTemplateCategoryToPromptTemplateDescriptor_B_index" ON "_PromptTemplateCategoryToPromptTemplateDescriptor"("B");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_descriptor" ADD CONSTRAINT "prompt_descriptor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt" ADD CONSTRAINT "prompt_id_fkey" FOREIGN KEY ("id") REFERENCES "prompt_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_category" ADD CONSTRAINT "prompt_category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_version" ADD CONSTRAINT "prompt_version_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_follow_up" ADD CONSTRAINT "prompt_follow_up_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_template_descriptor" ADD CONSTRAINT "prompt_template_descriptor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_template_descriptor" ADD CONSTRAINT "prompt_template_descriptor_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_template_global_field" ADD CONSTRAINT "prompt_template_global_field_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_template_global_field" ADD CONSTRAINT "prompt_template_global_field_global_field_id_fkey" FOREIGN KEY ("global_field_id") REFERENCES "global_field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_template_field" ADD CONSTRAINT "prompt_template_field_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_template_category" ADD CONSTRAINT "prompt_template_category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_field" ADD CONSTRAINT "global_field_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_history" ADD CONSTRAINT "subscription_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptCategoryToPromptDescriptor" ADD CONSTRAINT "_PromptCategoryToPromptDescriptor_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptCategoryToPromptDescriptor" ADD CONSTRAINT "_PromptCategoryToPromptDescriptor_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptTemplateCategoryToPromptTemplateDescriptor" ADD CONSTRAINT "_PromptTemplateCategoryToPromptTemplateDescriptor_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt_template_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptTemplateCategoryToPromptTemplateDescriptor" ADD CONSTRAINT "_PromptTemplateCategoryToPromptTemplateDescriptor_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt_template_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
