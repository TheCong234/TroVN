-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_advertisingPackageId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "invoiceId" TEXT;
