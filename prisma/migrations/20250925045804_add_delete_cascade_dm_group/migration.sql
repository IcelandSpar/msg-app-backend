-- DropForeignKey
ALTER TABLE "public"."DirectMessageGroup" DROP CONSTRAINT "DirectMessageGroup_friendId_fkey";

-- AddForeignKey
ALTER TABLE "public"."DirectMessageGroup" ADD CONSTRAINT "DirectMessageGroup_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "public"."Friend"("id") ON DELETE CASCADE ON UPDATE CASCADE;
