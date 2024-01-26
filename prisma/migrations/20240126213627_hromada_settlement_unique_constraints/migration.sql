/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Hromada` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hromadaId,name]` on the table `Settlement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Hromada_name_key" ON "Hromada"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_hromadaId_name_key" ON "Settlement"("hromadaId", "name");
