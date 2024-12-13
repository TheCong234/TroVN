-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'FEE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "fee" DOUBLE PRECISION NOT NULL,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "withdrawalRequestId" TEXT,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WithdrawalRequest_userId_status_idx" ON "WithdrawalRequest"("userId", "status");

-- CreateIndex
CREATE INDEX "TransactionHistory_userId_status_idx" ON "TransactionHistory"("userId", "status");

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_withdrawalRequestId_fkey" FOREIGN KEY ("withdrawalRequestId") REFERENCES "WithdrawalRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
