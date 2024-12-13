/*
  Warnings:

  - You are about to alter the column `duration` on the `AdvertisingPackage` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `limit` on the `Package` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `rating` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `violationCount` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `limit` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.

*/
-- AlterTable
ALTER TABLE "AdvertisingPackage" ALTER COLUMN "duration" SET DATA TYPE INT4;

-- AlterTable
ALTER TABLE "Package" ALTER COLUMN "limit" SET DATA TYPE INT4;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET DATA TYPE INT4;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "violationCount" SET DATA TYPE INT4;
ALTER TABLE "User" ALTER COLUMN "limit" SET DATA TYPE INT4;
