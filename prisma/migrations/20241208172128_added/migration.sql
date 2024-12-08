-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "rulesetId" INTEGER;

-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "formOrder" INTEGER[];
