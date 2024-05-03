/*
  Warnings:

  - The `topic_id` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "topic_id",
ADD COLUMN     "topic_id" INTEGER;
