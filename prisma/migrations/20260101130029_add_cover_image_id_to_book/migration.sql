/*
  Warnings:

  - Made the column `capacity` on table `classes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guardianName` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guardianPhone` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "coverImagePublicId" TEXT;

-- AlterTable
ALTER TABLE "classes" ALTER COLUMN "capacity" SET NOT NULL;

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "guardianName" SET NOT NULL,
ALTER COLUMN "guardianPhone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
