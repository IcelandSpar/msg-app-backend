/*
  Warnings:

  - You are about to alter the column `groupImgPath` on the `Group` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(260)`.

*/
-- AlterTable
ALTER TABLE "public"."Group" ALTER COLUMN "groupImgPath" SET DATA TYPE VARCHAR(260);

-- CreateTable
CREATE TABLE "public"."MessageImg" (
    "id" TEXT NOT NULL,
    "imgPath" VARCHAR(260) NOT NULL,
    "spoiler" BOOLEAN NOT NULL DEFAULT false,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessageImg_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MessageImg" ADD CONSTRAINT "MessageImg_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
