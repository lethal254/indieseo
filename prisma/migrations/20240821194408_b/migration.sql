/*
  Warnings:

  - Added the required column `jobid` to the `AuditResults` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuditResults" ADD COLUMN     "jobid" INTEGER NOT NULL;
