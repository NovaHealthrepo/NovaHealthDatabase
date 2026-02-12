/*
  Warnings:

  - You are about to alter the column `duration` on the `Index` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(4,1)`.

*/
-- AlterTable
ALTER TABLE "Index" ALTER COLUMN "duration" SET DEFAULT 2,
ALTER COLUMN "duration" SET DATA TYPE DECIMAL(4,1);
