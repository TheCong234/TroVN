/*
  Warnings:

  - You are about to drop the column `contractId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the `Contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resident` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `slug` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentedRoomId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMER', 'DONE', 'CANCELED');

-- CreateEnum
CREATE TYPE "RentedStatus" AS ENUM ('PENDING', 'CONFIRMER', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_listingId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_contractId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_residentId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_contractId_fkey";

-- DropForeignKey
ALTER TABLE "Resident" DROP CONSTRAINT "Resident_contractId_fkey";

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "contractId",
ADD COLUMN     "rentedRoomId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "isRented" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "zaloAvatar" TEXT DEFAULT '',
ADD COLUMN     "zaloId" TEXT DEFAULT '',
ADD COLUMN     "zaloIdByOA" TEXT DEFAULT '',
ADD COLUMN     "zaloName" TEXT DEFAULT '';

-- DropTable
DROP TABLE "Contract";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "Resident";

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentedRoom" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "RentedStatus" NOT NULL DEFAULT 'PENDING',
    "isTenantConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isOwnerConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentedRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RentedRoom_listingId_userId_startDate_key" ON "RentedRoom"("listingId", "userId", "startDate");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_rentedRoomId_fkey" FOREIGN KEY ("rentedRoomId") REFERENCES "RentedRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentedRoom" ADD CONSTRAINT "RentedRoom_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentedRoom" ADD CONSTRAINT "RentedRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
