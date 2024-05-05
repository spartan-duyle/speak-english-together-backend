/*
  Warnings:

  - You are about to drop the column `muted` on the `RoomMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoomMember" DROP COLUMN "muted",
ADD COLUMN     "is_muted" BOOLEAN NOT NULL DEFAULT false;
