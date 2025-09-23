/*
  Warnings:

  - Added the required column `directMessageGroupId` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Friend" ADD COLUMN     "directMessageGroupId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Friend" ADD CONSTRAINT "Friend_directMessageGroupId_fkey" FOREIGN KEY ("directMessageGroupId") REFERENCES "public"."DirectMessageGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
