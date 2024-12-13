-- AlterTable
ALTER TABLE "TransactionHistory" ADD COLUMN     "paymentInfoId" TEXT;

-- AlterTable
ALTER TABLE "WithdrawalRequest" ADD COLUMN     "paymentInfoId" TEXT;

-- CreateTable
CREATE TABLE "PaymentInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "provider" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentInfo_userId_isPrimary_idx" ON "PaymentInfo"("userId", "isPrimary");

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_paymentInfoId_fkey" FOREIGN KEY ("paymentInfoId") REFERENCES "PaymentInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_paymentInfoId_fkey" FOREIGN KEY ("paymentInfoId") REFERENCES "PaymentInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentInfo" ADD CONSTRAINT "PaymentInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
