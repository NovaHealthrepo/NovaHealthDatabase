/*
  Warnings:

  - Added the required column `date` to the `Index` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceID` to the `Index` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportTime` to the `Index` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `Index` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `StaffProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StaffProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondPhone` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Index" ADD COLUMN     "date" DATE NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "isAttended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRecorded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isfreelance" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "priceID" INTEGER NOT NULL,
ADD COLUMN     "reportTime" TIME NOT NULL,
ADD COLUMN     "salary" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StaffProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isEmployed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "contactPerson" TEXT NOT NULL DEFAULT '本人',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "secondContactPerson" TEXT NOT NULL DEFAULT '沒有第二聯絡人',
ADD COLUMN     "secondPhone" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Price" (
    "priceID" SERIAL NOT NULL,
    "service" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "exception" TEXT NOT NULL DEFAULT 'default',

    CONSTRAINT "Price_pkey" PRIMARY KEY ("priceID")
);

-- CreateTable
CREATE TABLE "Summary" (
    "Month" TEXT NOT NULL,
    "totalIncome" DECIMAL(65,30) NOT NULL,
    "totalSalary" DECIMAL(65,30) NOT NULL,
    "numberOfClient" INTEGER NOT NULL,
    "numberOfStaff" INTEGER NOT NULL,
    "ptHours" INTEGER NOT NULL,
    "otHours" INTEGER NOT NULL,
    "stHours" INTEGER NOT NULL,
    "nurseHours" INTEGER NOT NULL,
    "supportingHours" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Summary_Month_key" ON "Summary"("Month");

-- AddForeignKey
ALTER TABLE "Index" ADD CONSTRAINT "Index_priceID_fkey" FOREIGN KEY ("priceID") REFERENCES "Price"("priceID") ON DELETE RESTRICT ON UPDATE CASCADE;
