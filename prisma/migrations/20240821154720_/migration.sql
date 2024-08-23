-- CreateTable
CREATE TABLE "AuditResults" (
    "id" SERIAL NOT NULL,
    "result" JSONB NOT NULL,
    "websiteid" INTEGER NOT NULL,

    CONSTRAINT "AuditResults_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditResults" ADD CONSTRAINT "AuditResults_websiteid_fkey" FOREIGN KEY ("websiteid") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
