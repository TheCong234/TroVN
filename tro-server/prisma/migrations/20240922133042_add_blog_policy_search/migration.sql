/*
  Warnings:

  - Added the required column `listingId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('PRIVACY_POLICY', 'TERMS_OF_SERVICE');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('SUPPORT', 'RENT');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "listingId" TEXT NOT NULL,
ADD COLUMN     "type" "ConversationType" NOT NULL DEFAULT 'RENT';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "hot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verify" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "limit" INTEGER NOT NULL DEFAULT 10;

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "PolicyType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogPostToBlogTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToBlogTag_AB_unique" ON "_BlogPostToBlogTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToBlogTag_B_index" ON "_BlogPostToBlogTag"("B");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToBlogTag" ADD CONSTRAINT "_BlogPostToBlogTag_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToBlogTag" ADD CONSTRAINT "_BlogPostToBlogTag_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
