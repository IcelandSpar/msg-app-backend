/*
  Warnings:

  - You are about to drop the column `userId` on the `FriendRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."FriendRequest" DROP CONSTRAINT "FriendRequest_userId_fkey";

-- AlterTable
ALTER TABLE "public"."FriendRequest" DROP COLUMN "userId";
