/*
  Warnings:

  - You are about to alter the column `salary` on the `Index` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,0)`.
  - You are about to alter the column `totalSalary` on the `Summary` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,0)`.

*/
-- AlterTable
ALTER TABLE "Index" ALTER COLUMN "salary" SET DATA TYPE DECIMAL(15,0);

-- AlterTable
ALTER TABLE "Summary" ALTER COLUMN "totalSalary" SET DATA TYPE DECIMAL(15,0);
