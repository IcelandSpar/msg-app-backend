/*
  Warnings:

  - You are about to drop the `_DirectMessageGroupToProfile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `friendId` to the `DirectMessageGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_DirectMessageGroupToProfile" DROP CONSTRAINT "_DirectMessageGroupToProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DirectMessageGroupToProfile" DROP CONSTRAINT "_DirectMessageGroupToProfile_B_fkey";

-- AlterTable
ALTER TABLE "public"."DirectMessageGroup" ADD COLUMN     "friendId" TEXT NOT NULL,
ADD COLUMN     "profileId" TEXT;

-- DropTable
DROP TABLE "public"."_DirectMessageGroupToProfile";

-- AddForeignKey
ALTER TABLE "public"."DirectMessageGroup" ADD CONSTRAINT "DirectMessageGroup_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "public"."Friend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DirectMessageGroup" ADD CONSTRAINT "DirectMessageGroup_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
