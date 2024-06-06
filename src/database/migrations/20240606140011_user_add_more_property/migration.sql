-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "learning_goals" TEXT[],
ADD COLUMN     "native_language" TEXT,
ADD COLUMN     "occupation" TEXT;
