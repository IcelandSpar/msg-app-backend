/*
  Warnings:

  - You are about to drop the column `directMessageGroupId` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_groupId_fkey";

-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "directMessageGroupId";

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
