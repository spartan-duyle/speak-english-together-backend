/*
  Warnings:

  - You are about to drop the column `suggestion_improves` on the `Paragraph` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paragraph" DROP COLUMN "suggestion_improves",
ADD COLUMN     "suggestion_improvements" TEXT[];
