/*
  Warnings:

  - You are about to drop the column `topic_id` on the `Paragraph` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_topic_id_fkey";

-- AlterTable
ALTER TABLE "Paragraph" DROP COLUMN "topic_id",
ADD COLUMN     "topic_name" TEXT;
