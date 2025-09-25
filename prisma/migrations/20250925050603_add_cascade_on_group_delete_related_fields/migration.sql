-- DropForeignKey
ALTER TABLE "public"."Member" DROP CONSTRAINT "Member_groupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Member" DROP CONSTRAINT "Member_profileId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
