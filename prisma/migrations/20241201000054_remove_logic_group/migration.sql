/*
  Warnings:

  - You are about to drop the column `logical_group_id` on the `Rule` table. All the data in the column will be lost.
  - You are about to drop the `LogicalGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LogicalGroup" DROP CONSTRAINT "LogicalGroup_ruleset_id_fkey";

-- DropForeignKey
ALTER TABLE "Rule" DROP CONSTRAINT "Rule_logical_group_id_fkey";

-- AlterTable
ALTER TABLE "Rule" DROP COLUMN "logical_group_id",
ADD COLUMN     "logicOperator" TEXT,
ADD COLUMN     "parent_rule_id" INTEGER;

-- DropTable
DROP TABLE "LogicalGroup";

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_parent_rule_id_fkey" FOREIGN KEY ("parent_rule_id") REFERENCES "Rule"("rule_id") ON DELETE SET NULL ON UPDATE CASCADE;
