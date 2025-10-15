-- CreateTable
CREATE TABLE "public"."YDocState" (
    "noteId" TEXT NOT NULL,
    "state" BYTEA NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YDocState_pkey" PRIMARY KEY ("noteId")
);

-- AddForeignKey
ALTER TABLE "public"."YDocState" ADD CONSTRAINT "YDocState_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "public"."Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
