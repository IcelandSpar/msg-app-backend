-- DropForeignKey
ALTER TABLE "public"."Group" DROP CONSTRAINT "Group_creatorId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Group" ADD CONSTRAINT "Group_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
