/*
  Warnings:

  - Changed the type of `gender` on the `StaffProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `address` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `UserProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- AlterTable
ALTER TABLE "Index" ADD COLUMN     "isReserved" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "StaffProfile" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '沒有電郵',
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL,
ALTER COLUMN "secondPhone" SET DEFAULT '沒有第二電話',
ALTER COLUMN "IDcard" SET DEFAULT '請盡快提供ID';
