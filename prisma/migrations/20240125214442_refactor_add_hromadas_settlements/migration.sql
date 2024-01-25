/*
  Warnings:

  - You are about to drop the column `districts` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Complainant` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Complainant` table. All the data in the column will be lost.
  - You are about to drop the column `complainantId` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `shelterId` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the `ComplaintReason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shelter` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[complaintId]` on the table `Complainant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `complaintId` to the `Complainant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reasonType` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settlementId` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shelterName` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_complainantId_fkey";

-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_shelterId_fkey";

-- DropForeignKey
ALTER TABLE "ComplaintReason" DROP CONSTRAINT "ComplaintReason_complaintId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "districts";

-- AlterTable
ALTER TABLE "Complainant" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "complaintId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "complainantId",
DROP COLUMN "shelterId",
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "reasonType" "ComplaintReasonType" NOT NULL,
ADD COLUMN     "settlementId" INTEGER NOT NULL,
ADD COLUMN     "shelterName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "ComplaintReason";

-- DropTable
DROP TABLE "Shelter";

-- CreateTable
CREATE TABLE "Hromada" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hromada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HromadaAdmin" (
    "adminId" TEXT NOT NULL,
    "hromadaId" INTEGER NOT NULL,

    CONSTRAINT "HromadaAdmin_pkey" PRIMARY KEY ("adminId","hromadaId")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hromadaId" INTEGER NOT NULL,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementAdmin" (
    "adminId" TEXT NOT NULL,
    "settlementId" INTEGER NOT NULL,

    CONSTRAINT "SettlementAdmin_pkey" PRIMARY KEY ("adminId","settlementId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Complainant_complaintId_key" ON "Complainant"("complaintId");

-- AddForeignKey
ALTER TABLE "HromadaAdmin" ADD CONSTRAINT "HromadaAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HromadaAdmin" ADD CONSTRAINT "HromadaAdmin_hromadaId_fkey" FOREIGN KEY ("hromadaId") REFERENCES "Hromada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_hromadaId_fkey" FOREIGN KEY ("hromadaId") REFERENCES "Hromada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementAdmin" ADD CONSTRAINT "SettlementAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementAdmin" ADD CONSTRAINT "SettlementAdmin_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complainant" ADD CONSTRAINT "Complainant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complainant" ADD CONSTRAINT "Complainant_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
