-- CreateTable
CREATE TABLE "Paragraph" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question" TEXT,
    "original_text" TEXT NOT NULL,
    "audio_link" TEXT,
    "updated_text" TEXT,
    "translated_updated_text" TEXT,
    "overall_comment" TEXT,
    "relevance_to_question" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_id" ON "Paragraph"("user_id");

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
