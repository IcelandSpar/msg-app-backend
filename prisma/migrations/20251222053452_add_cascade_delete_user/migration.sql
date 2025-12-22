-- DropForeignKey
ALTER TABLE "public"."Friend" DROP CONSTRAINT "Friend_friendOneId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Friend" DROP CONSTRAINT "Friend_friendTwoId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Friend" ADD CONSTRAINT "Friend_friendOneId_fkey" FOREIGN KEY ("friendOneId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Friend" ADD CONSTRAINT "Friend_friendTwoId_fkey" FOREIGN KEY ("friendTwoId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
