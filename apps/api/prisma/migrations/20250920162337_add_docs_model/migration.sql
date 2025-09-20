-- DropForeignKey
ALTER TABLE "public"."Document" DROP CONSTRAINT "Document_parentId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
