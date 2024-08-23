-- CreateTable
CREATE TABLE "Website" (
    "id" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
