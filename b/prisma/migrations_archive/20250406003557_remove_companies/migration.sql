/*
  Warnings:

  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_fkey";

-- DropTable
DROP TABLE "companies";
