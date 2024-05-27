-- AlterTable
ALTER TABLE "Vocabulary" ADD COLUMN     "vocabulary_topic_id" INTEGER;

-- CreateTable
CREATE TABLE "VocabularyTopic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "VocabularyTopic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_vocabulary_topic_id_fkey" FOREIGN KEY ("vocabulary_topic_id") REFERENCES "VocabularyTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
