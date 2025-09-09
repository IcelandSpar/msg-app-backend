-- DropForeignKey
ALTER TABLE "public"."DirectMessage" DROP CONSTRAINT "DirectMessage_directMessageGroupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_directMessageGroupId_fkey";

-- CreateTable
CREATE TABLE "public"."_DirectMessageGroupToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DirectMessageGroupToProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DirectMessageGroupToProfile_B_index" ON "public"."_DirectMessageGroupToProfile"("B");

-- AddForeignKey
ALTER TABLE "public"."DirectMessage" ADD CONSTRAINT "DirectMessage_directMessageGroupId_fkey" FOREIGN KEY ("directMessageGroupId") REFERENCES "public"."DirectMessageGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DirectMessageGroupToProfile" ADD CONSTRAINT "_DirectMessageGroupToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."DirectMessageGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DirectMessageGroupToProfile" ADD CONSTRAINT "_DirectMessageGroupToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
