/*
  Warnings:

  - You are about to drop the column `suggestion_says` on the `Paragraph` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paragraph" DROP COLUMN "suggestion_says",
ADD COLUMN     "suggestion_answers" TEXT[];
