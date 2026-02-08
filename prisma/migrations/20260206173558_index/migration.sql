/*
  Warnings:

  - You are about to drop the column `priceID` on the `Index` table. All the data in the column will be lost.
  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Price` to the `Index` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Index" DROP CONSTRAINT "Index_priceID_fkey";

-- AlterTable
ALTER TABLE "Index" DROP COLUMN "priceID",
ADD COLUMN     "Price" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Price";
