/*
  Warnings:

  - You are about to drop the column `formOrder` on the `Ruleset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_rulesetId_fkey";

-- AlterTable
ALTER TABLE "Ruleset" DROP COLUMN "formOrder",
ADD COLUMN     "attribute_ids" INTEGER[];
