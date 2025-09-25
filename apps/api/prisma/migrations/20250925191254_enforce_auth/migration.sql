/*
  Warnings:

  - The values [VIEWER] on the enum `CollaboratorRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CollaboratorRole_new" AS ENUM ('EDITOR', 'CREATOR');
ALTER TABLE "public"."NoteCollaborator" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."NoteCollaborator" ALTER COLUMN "role" TYPE "public"."CollaboratorRole_new" USING ("role"::text::"public"."CollaboratorRole_new");
ALTER TYPE "public"."CollaboratorRole" RENAME TO "CollaboratorRole_old";
ALTER TYPE "public"."CollaboratorRole_new" RENAME TO "CollaboratorRole";
DROP TYPE "public"."CollaboratorRole_old";
ALTER TABLE "public"."NoteCollaborator" ALTER COLUMN "role" SET DEFAULT 'EDITOR';
COMMIT;
