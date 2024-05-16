-- CreateTable
CREATE TABLE "Follower" (
    "id" SERIAL NOT NULL,
    "followed_id" INTEGER NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
