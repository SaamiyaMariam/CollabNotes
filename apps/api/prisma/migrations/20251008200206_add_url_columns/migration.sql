/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,url]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,folderId,url]` on the table `Note` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Folder" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_url_key" ON "public"."Folder"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_ownerId_url_key" ON "public"."Folder"("ownerId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "Note_ownerId_folderId_url_key" ON "public"."Note"("ownerId", "folderId", "url");
