/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'BASIC', 'PRO');

-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'INCOMPLETE', 'PAST_DUE', 'UNPAID', 'TRIALING', 'PAUSED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "stripe_customer_id" VARCHAR(250);

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
CREATE UNIQUE INDEX "user_stripe_customer_id_key" ON "user"("stripe_customer_id");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_history" ADD CONSTRAINT "subscription_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
