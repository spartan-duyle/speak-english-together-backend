/*
  Warnings:

  - You are about to drop the column `audio_link` on the `Paragraph` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paragraph" DROP COLUMN "audio_link",
ADD COLUMN     "audio_url" TEXT;
