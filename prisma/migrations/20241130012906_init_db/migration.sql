-- CreateEnum
CREATE TYPE "ProgramCategory" AS ENUM ('BACHELOR', 'MASTER', 'ACCELERATED', 'PHD');

-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('text', 'number', 'date', 'datetime', 'boolean', 'dropdown', 'multiselect', 'file', 'calculated');

-- CreateEnum
CREATE TYPE "AttributeVariant" AS ENUM ('singleLine', 'multiLine');

-- CreateTable
CREATE TABLE "AttributeCategory" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AttributeCategory_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "attribute_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "categoryId" INTEGER,
    "type" "AttributeType" NOT NULL,
    "variant" "AttributeVariant",
    "fileLink" TEXT,
    "validationRule" JSONB,
    "isGlobal" BOOLEAN NOT NULL,
    "rulesetId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("attribute_id")
);

-- CreateTable
CREATE TABLE "Program" (
    "program_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "program_category" "ProgramCategory" NOT NULL,
    "program_type" TEXT NOT NULL,
    "umbc_link" TEXT,
    "rubric_id" INTEGER,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "Rubric" (
    "rubric_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "max_weight" INTEGER NOT NULL,

    CONSTRAINT "Rubric_pkey" PRIMARY KEY ("rubric_id")
);

-- CreateTable
CREATE TABLE "Ruleset" (
    "ruleset_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "max_weight" INTEGER NOT NULL,

    CONSTRAINT "Ruleset_pkey" PRIMARY KEY ("ruleset_id")
);

-- CreateTable
CREATE TABLE "RubricRuleset" (
    "rubric_id" INTEGER NOT NULL,
    "ruleset_id" INTEGER NOT NULL,

    CONSTRAINT "RubricRuleset_pkey" PRIMARY KEY ("rubric_id","ruleset_id")
);

-- CreateTable
CREATE TABLE "LogicalGroup" (
    "logic_group_id" SERIAL NOT NULL,
    "ruleset_id" INTEGER,
    "parent_logic_group_id" INTEGER,
    "logic_operator" TEXT NOT NULL,
    "action" JSONB NOT NULL,

    CONSTRAINT "LogicalGroup_pkey" PRIMARY KEY ("logic_group_id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "rule_id" SERIAL NOT NULL,
    "ruleset_id" INTEGER NOT NULL,
    "logic_group_id" INTEGER,
    "target_attribute_id" INTEGER,
    "target_option_value" TEXT,
    "action" JSONB NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("rule_id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "condition_id" SERIAL NOT NULL,
    "rule_id" INTEGER NOT NULL,
    "evaluated_attribute_id" INTEGER NOT NULL,
    "operator" TEXT NOT NULL,
    "value_1" JSONB NOT NULL,
    "value_2" JSONB,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("condition_id")
);

-- CreateTable
CREATE TABLE "RulesetAttributeConfig" (
    "config_id" SERIAL NOT NULL,
    "ruleset_id" INTEGER NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "RulesetAttributeConfig_pkey" PRIMARY KEY ("config_id")
);

-- CreateTable
CREATE TABLE "RubricSectionConfig" (
    "section_id" SERIAL NOT NULL,
    "rubric_id" INTEGER NOT NULL,
    "ruleset_id" INTEGER NOT NULL,
    "section_order" INTEGER NOT NULL,
    "section_name" TEXT NOT NULL,

    CONSTRAINT "RubricSectionConfig_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "attachment_id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "file_path" TEXT NOT NULL,
    "attachment_type" TEXT NOT NULL,
    "studentSubmissionSubmission_id" INTEGER,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateTable
CREATE TABLE "StudentSubmission" (
    "submission_id" SERIAL NOT NULL,
    "program_id" INTEGER NOT NULL,
    "student_id" TEXT NOT NULL,
    "submission_data" JSONB NOT NULL,
    "evaluation_score" JSONB NOT NULL,

    CONSTRAINT "StudentSubmission_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "_ReferencedAttributes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AttributeCategory_name_key" ON "AttributeCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_name_key" ON "Attribute"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ReferencedAttributes_AB_unique" ON "_ReferencedAttributes"("A", "B");

-- CreateIndex
CREATE INDEX "_ReferencedAttributes_B_index" ON "_ReferencedAttributes"("B");

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("ruleset_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AttributeCategory"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "Rubric"("rubric_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricRuleset" ADD CONSTRAINT "RubricRuleset_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "Rubric"("rubric_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricRuleset" ADD CONSTRAINT "RubricRuleset_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("ruleset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogicalGroup" ADD CONSTRAINT "LogicalGroup_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("ruleset_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_logic_group_id_fkey" FOREIGN KEY ("logic_group_id") REFERENCES "LogicalGroup"("logic_group_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("ruleset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "Rule"("rule_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RulesetAttributeConfig" ADD CONSTRAINT "RulesetAttributeConfig_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("ruleset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RulesetAttributeConfig" ADD CONSTRAINT "RulesetAttributeConfig_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Attribute"("attribute_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricSectionConfig" ADD CONSTRAINT "RubricSectionConfig_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "Rubric"("rubric_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricSectionConfig" ADD CONSTRAINT "RubricSectionConfig_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("ruleset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_studentSubmissionSubmission_id_fkey" FOREIGN KEY ("studentSubmissionSubmission_id") REFERENCES "StudentSubmission"("submission_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReferencedAttributes" ADD CONSTRAINT "_ReferencedAttributes_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("attribute_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReferencedAttributes" ADD CONSTRAINT "_ReferencedAttributes_B_fkey" FOREIGN KEY ("B") REFERENCES "Attribute"("attribute_id") ON DELETE CASCADE ON UPDATE CASCADE;
