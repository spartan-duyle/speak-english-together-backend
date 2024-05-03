/*
  Warnings:

  - Changed the type of `host_user_id` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "host_user_id",
ADD COLUMN     "host_user_id" INTEGER NOT NULL;
