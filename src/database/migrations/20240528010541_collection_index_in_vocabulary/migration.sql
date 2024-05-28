-- DropIndex
DROP INDEX "Vocabulary_collection_id_key";

-- CreateIndex
CREATE INDEX "Vocabulary_collection_id_idx" ON "Vocabulary"("collection_id");
