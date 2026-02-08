/*
  Warnings:

  - You are about to drop the column `age` on the `StaffProfile` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `UserProfile` table. All the data in the column will be lost.
  - Added the required column `IDcard` to the `StaffProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth` to the `StaffProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IDcard` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StaffProfile" DROP COLUMN "age",
ADD COLUMN     "IDcard" TEXT NOT NULL,
ADD COLUMN     "birth" DATE NOT NULL;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "age",
ADD COLUMN     "IDcard" TEXT NOT NULL,
ADD COLUMN     "birth" DATE NOT NULL;
