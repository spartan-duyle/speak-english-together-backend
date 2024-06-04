-- AlterTable
ALTER TABLE "Paragraph" ADD COLUMN     "level" TEXT,
ADD COLUMN     "topic_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
