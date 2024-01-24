/*
  Warnings:

  - You are about to drop the column `firstName` on the `Complainant` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Complainant` table. All the data in the column will be lost.
  - You are about to drop the column `patronymic` on the `Complainant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Complainant" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "patronymic",
ADD COLUMN     "fullName" TEXT;
