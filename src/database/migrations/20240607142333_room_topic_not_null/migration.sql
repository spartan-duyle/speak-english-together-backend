/*
  Warnings:

  - Made the column `topic_id` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_topic_id_fkey";

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "topic_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
