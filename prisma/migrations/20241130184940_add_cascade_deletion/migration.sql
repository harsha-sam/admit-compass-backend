-- DropForeignKey
ALTER TABLE "Condition" DROP CONSTRAINT "Condition_rule_id_fkey";

-- DropForeignKey
ALTER TABLE "Rule" DROP CONSTRAINT "Rule_ruleset_id_fkey";

-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "baseWeight" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("rulesetId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "Rule"("rule_id") ON DELETE CASCADE ON UPDATE CASCADE;
