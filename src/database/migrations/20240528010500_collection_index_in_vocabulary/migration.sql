/*
  Warnings:

  - A unique constraint covering the columns `[collection_id]` on the table `Vocabulary` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vocabulary_collection_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Vocabulary_collection_id_key" ON "Vocabulary"("collection_id");
