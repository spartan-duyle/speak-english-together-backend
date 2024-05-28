/*
  Warnings:

  - You are about to drop the column `vocabulary_topic_id` on the `Vocabulary` table. All the data in the column will be lost.
  - You are about to drop the `VocabularyTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_vocabulary_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "VocabularyTopic" DROP CONSTRAINT "VocabularyTopic_user_id_fkey";

-- DropIndex
DROP INDEX "Vocabulary_vocabulary_topic_id_idx";

-- AlterTable
ALTER TABLE "Vocabulary" DROP COLUMN "vocabulary_topic_id",
ADD COLUMN     "collection_id" INTEGER;

-- DropTable
DROP TABLE "VocabularyTopic";

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_name_user_id_deleted_at_key" ON "Collection"("name", "user_id", "deleted_at");

-- CreateIndex
CREATE INDEX "Vocabulary_collection_id_idx" ON "Vocabulary"("collection_id");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
