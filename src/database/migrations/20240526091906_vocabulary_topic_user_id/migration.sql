/*
  Warnings:

  - A unique constraint covering the columns `[name,user_id]` on the table `VocabularyTopic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Vocabulary_vocabulary_topic_id_idx" ON "Vocabulary"("vocabulary_topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyTopic_name_user_id_key" ON "VocabularyTopic"("name", "user_id");
