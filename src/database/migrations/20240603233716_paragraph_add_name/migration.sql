/*
  Warnings:

  - Made the column `name` on table `Paragraph` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Paragraph" ALTER COLUMN "name" SET NOT NULL;
