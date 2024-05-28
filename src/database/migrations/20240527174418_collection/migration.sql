/*
  Warnings:

  - A unique constraint covering the columns `[collection_id]` on the table `Vocabulary` will be added. If there are existing duplicate values, this will fail.
  - Made the column `collection_id` on table `Vocabulary` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_collection_id_fkey";

-- DropIndex
DROP INDEX "Vocabulary_collection_id_idx";

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "Vocabulary" ALTER COLUMN "collection_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Vocabulary_collection_id_key" ON "Vocabulary"("collection_id");

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
