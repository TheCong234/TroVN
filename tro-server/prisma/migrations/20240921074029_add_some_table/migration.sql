-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "electricityFee" DOUBLE PRECISION NOT NULL,
    "waterFee" DOUBLE PRECISION NOT NULL,
    "otherFee" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "contractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "rentAmount" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "listingId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "contractId" TEXT,
    "residentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resident" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "identityCard" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "contractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
