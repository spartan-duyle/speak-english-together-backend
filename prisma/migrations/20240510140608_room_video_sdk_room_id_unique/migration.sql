/*
  Warnings:

  - A unique constraint covering the columns `[video_sdk_room_id]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Room_video_sdk_room_id_key" ON "Room"("video_sdk_room_id");
