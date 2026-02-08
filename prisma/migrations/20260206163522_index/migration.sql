/*
  Warnings:

  - You are about to drop the column `positionID` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_positionID_fkey";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "positionID",
ADD COLUMN     "position" TEXT NOT NULL DEFAULT 'Pending',
ALTER COLUMN "name" SET DEFAULT 'Pending';

-- DropTable
DROP TABLE "Position";

-- CreateTable
CREATE TABLE "PositionProfile" (
    "positionID" SERIAL NOT NULL,
    "position" TEXT NOT NULL DEFAULT 'Pending',

    CONSTRAINT "PositionProfile_pkey" PRIMARY KEY ("positionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "PositionProfile_position_key" ON "PositionProfile"("position");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_position_fkey" FOREIGN KEY ("position") REFERENCES "PositionProfile"("position") ON DELETE RESTRICT ON UPDATE CASCADE;
