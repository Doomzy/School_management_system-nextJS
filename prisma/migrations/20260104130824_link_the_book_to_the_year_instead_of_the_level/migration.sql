/*
  Warnings:

  - You are about to drop the column `level` on the `books` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,bookId]` on the table `book_distributions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `yearId` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "books_level_idx";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "level",
ADD COLUMN     "yearId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "book_distributions_studentId_bookId_key" ON "book_distributions"("studentId", "bookId");

-- CreateIndex
CREATE INDEX "books_yearId_idx" ON "books"("yearId");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
