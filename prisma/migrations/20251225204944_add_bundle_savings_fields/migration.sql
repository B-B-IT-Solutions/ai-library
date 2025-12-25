-- AlterTable
ALTER TABLE "product" ADD COLUMN     "savings_amount" DECIMAL(10,2),
ADD COLUMN     "savings_percentage" DECIMAL(5,2),
ADD COLUMN     "total_individual_price" DECIMAL(10,2);
