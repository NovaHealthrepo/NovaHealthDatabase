/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "userID" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userID");

-- CreateTable
CREATE TABLE "Index" (
    "serviceID" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "time" TIME NOT NULL,
    "userID" INTEGER NOT NULL,
    "staffID" INTEGER NOT NULL,

    CONSTRAINT "Index_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "Staff" (
    "staffID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "positionID" INTEGER NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("staffID")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "userID" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "StaffProfile" (
    "staffID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Position" (
    "positionID" SERIAL NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("positionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userID_key" ON "UserProfile"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "StaffProfile_staffID_key" ON "StaffProfile"("staffID");

-- CreateIndex
CREATE UNIQUE INDEX "Position_position_key" ON "Position"("position");

-- AddForeignKey
ALTER TABLE "Index" ADD CONSTRAINT "Index_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Index" ADD CONSTRAINT "Index_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_positionID_fkey" FOREIGN KEY ("positionID") REFERENCES "Position"("positionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffProfile" ADD CONSTRAINT "StaffProfile_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;
