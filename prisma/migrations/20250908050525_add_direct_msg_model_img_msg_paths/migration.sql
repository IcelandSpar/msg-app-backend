-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "attatchedImagePath" VARCHAR(260),
ALTER COLUMN "messageContent" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "directMessageGroupId" TEXT;

-- CreateTable
CREATE TABLE "public"."DirectMessageGroup" (
    "id" TEXT NOT NULL,

    CONSTRAINT "DirectMessageGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DirectMessage" (
    "id" TEXT NOT NULL,
    "attatchedImagePath" VARCHAR(260),
    "messageContent" VARCHAR(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "directMessageGroupId" TEXT NOT NULL,

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_directMessageGroupId_fkey" FOREIGN KEY ("directMessageGroupId") REFERENCES "public"."DirectMessageGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DirectMessage" ADD CONSTRAINT "DirectMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DirectMessage" ADD CONSTRAINT "DirectMessage_directMessageGroupId_fkey" FOREIGN KEY ("directMessageGroupId") REFERENCES "public"."DirectMessageGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
