/*
  Warnings:

  - A unique constraint covering the columns `[stripe_checkout_session_id]` on the table `order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "stripe_checkout_session_id" VARCHAR(500),
ADD COLUMN     "stripe_payment_intent_id" VARCHAR(500),
ADD COLUMN     "stripe_payment_status" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "order_stripe_checkout_session_id_key" ON "order"("stripe_checkout_session_id");
