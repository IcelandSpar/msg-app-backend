/*
  Warnings:

  - You are about to drop the column `profileId` on the `DirectMessageGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."DirectMessageGroup" DROP CONSTRAINT "DirectMessageGroup_profileId_fkey";

-- AlterTable
ALTER TABLE "public"."DirectMessageGroup" DROP COLUMN "profileId";
