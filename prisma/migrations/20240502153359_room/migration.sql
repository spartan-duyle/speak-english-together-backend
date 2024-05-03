-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "host_user_id" TEXT NOT NULL,
    "topic_id" TEXT,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "description" TEXT,
    "thumbnail" TEXT,
    "max_member_amount" INTEGER,
    "current_member_amount" INTEGER NOT NULL DEFAULT 1,
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
