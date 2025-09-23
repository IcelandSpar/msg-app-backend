/*
  Warnings:

  - You are about to drop the column `directMessageGroupId` on the `Friend` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Friend" DROP CONSTRAINT "Friend_directMessageGroupId_fkey";

-- AlterTable
ALTER TABLE "public"."Friend" DROP COLUMN "directMessageGroupId";
