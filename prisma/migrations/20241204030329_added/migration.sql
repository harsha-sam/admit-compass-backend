/*
  Warnings:

  - Added the required column `description` to the `Ruleset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "description" TEXT NOT NULL;
