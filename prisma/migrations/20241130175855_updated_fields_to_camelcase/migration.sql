/*
  Warnings:

  - The primary key for the `Attachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attachment_id` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `attachment_type` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `file_path` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `studentSubmissionSubmission_id` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `submission_id` on the `Attachment` table. All the data in the column will be lost.
  - The primary key for the `Attribute` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attribute_id` on the `Attribute` table. All the data in the column will be lost.
  - The primary key for the `AttributeCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `AttributeCategory` table. All the data in the column will be lost.
  - The primary key for the `LogicalGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `logic_group_id` on the `LogicalGroup` table. All the data in the column will be lost.
  - You are about to drop the column `parent_logic_group_id` on the `LogicalGroup` table. All the data in the column will be lost.
  - The primary key for the `Program` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `program_category` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `program_id` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `program_type` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `rubric_id` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `umbc_link` on the `Program` table. All the data in the column will be lost.
  - The primary key for the `Rubric` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `max_weight` on the `Rubric` table. All the data in the column will be lost.
  - You are about to drop the column `rubric_id` on the `Rubric` table. All the data in the column will be lost.
  - You are about to drop the column `logic_group_id` on the `Rule` table. All the data in the column will be lost.
  - The primary key for the `Ruleset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `max_weight` on the `Ruleset` table. All the data in the column will be lost.
  - You are about to drop the column `ruleset_id` on the `Ruleset` table. All the data in the column will be lost.
  - The primary key for the `StudentSubmission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `evaluation_score` on the `StudentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `program_id` on the `StudentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `StudentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `submission_data` on the `StudentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `submission_id` on the `StudentSubmission` table. All the data in the column will be lost.
  - Added the required column `attachmentType` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionId` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programCategory` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programType` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxWeight` to the `Ruleset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluationScore` to the `StudentSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programId` to the `StudentSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `StudentSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionData` to the `StudentSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_studentSubmissionSubmission_id_fkey";

-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_rulesetId_fkey";

-- DropForeignKey
ALTER TABLE "LogicalGroup" DROP CONSTRAINT "LogicalGroup_ruleset_id_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_rubric_id_fkey";

-- DropForeignKey
ALTER TABLE "RubricRuleset" DROP CONSTRAINT "RubricRuleset_rubric_id_fkey";

-- DropForeignKey
ALTER TABLE "RubricRuleset" DROP CONSTRAINT "RubricRuleset_ruleset_id_fkey";

-- DropForeignKey
ALTER TABLE "RubricSectionConfig" DROP CONSTRAINT "RubricSectionConfig_rubric_id_fkey";

-- DropForeignKey
ALTER TABLE "RubricSectionConfig" DROP CONSTRAINT "RubricSectionConfig_ruleset_id_fkey";

-- DropForeignKey
ALTER TABLE "Rule" DROP CONSTRAINT "Rule_logic_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Rule" DROP CONSTRAINT "Rule_ruleset_id_fkey";

-- DropForeignKey
ALTER TABLE "RulesetAttributeConfig" DROP CONSTRAINT "RulesetAttributeConfig_attribute_id_fkey";

-- DropForeignKey
ALTER TABLE "RulesetAttributeConfig" DROP CONSTRAINT "RulesetAttributeConfig_ruleset_id_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_pkey",
DROP COLUMN "attachment_id",
DROP COLUMN "attachment_type",
DROP COLUMN "file_path",
DROP COLUMN "studentSubmissionSubmission_id",
DROP COLUMN "submission_id",
ADD COLUMN     "attachmentId" SERIAL NOT NULL,
ADD COLUMN     "attachmentType" TEXT NOT NULL,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "studentSubmissionSubmissionId" INTEGER,
ADD COLUMN     "submissionId" INTEGER NOT NULL,
ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY ("attachmentId");

-- AlterTable
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_pkey",
DROP COLUMN "attribute_id",
ADD COLUMN     "attributeId" SERIAL NOT NULL,
ADD CONSTRAINT "Attribute_pkey" PRIMARY KEY ("attributeId");

-- AlterTable
ALTER TABLE "AttributeCategory" DROP CONSTRAINT "AttributeCategory_pkey",
DROP COLUMN "category_id",
ADD COLUMN     "categoryId" SERIAL NOT NULL,
ADD CONSTRAINT "AttributeCategory_pkey" PRIMARY KEY ("categoryId");

-- AlterTable
ALTER TABLE "LogicalGroup" DROP CONSTRAINT "LogicalGroup_pkey",
DROP COLUMN "logic_group_id",
DROP COLUMN "parent_logic_group_id",
ADD COLUMN     "logical_group_id" SERIAL NOT NULL,
ADD COLUMN     "parent_logical_group_id" INTEGER,
ADD CONSTRAINT "LogicalGroup_pkey" PRIMARY KEY ("logical_group_id");

-- AlterTable
ALTER TABLE "Program" DROP CONSTRAINT "Program_pkey",
DROP COLUMN "program_category",
DROP COLUMN "program_id",
DROP COLUMN "program_type",
DROP COLUMN "rubric_id",
DROP COLUMN "umbc_link",
ADD COLUMN     "programCategory" "ProgramCategory" NOT NULL,
ADD COLUMN     "programId" SERIAL NOT NULL,
ADD COLUMN     "programType" TEXT NOT NULL,
ADD COLUMN     "rubricId" INTEGER,
ADD COLUMN     "umbcLink" TEXT,
ADD CONSTRAINT "Program_pkey" PRIMARY KEY ("programId");

-- AlterTable
ALTER TABLE "Rubric" DROP CONSTRAINT "Rubric_pkey",
DROP COLUMN "max_weight",
DROP COLUMN "rubric_id",
ADD COLUMN     "maxWeight" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rubricId" SERIAL NOT NULL,
ADD CONSTRAINT "Rubric_pkey" PRIMARY KEY ("rubricId");

-- AlterTable
ALTER TABLE "Rule" DROP COLUMN "logic_group_id",
ADD COLUMN     "logical_group_id" INTEGER;

-- AlterTable
ALTER TABLE "Ruleset" DROP CONSTRAINT "Ruleset_pkey",
DROP COLUMN "max_weight",
DROP COLUMN "ruleset_id",
ADD COLUMN     "maxWeight" INTEGER NOT NULL,
ADD COLUMN     "rulesetId" SERIAL NOT NULL,
ADD CONSTRAINT "Ruleset_pkey" PRIMARY KEY ("rulesetId");

-- AlterTable
ALTER TABLE "StudentSubmission" DROP CONSTRAINT "StudentSubmission_pkey",
DROP COLUMN "evaluation_score",
DROP COLUMN "program_id",
DROP COLUMN "student_id",
DROP COLUMN "submission_data",
DROP COLUMN "submission_id",
ADD COLUMN     "evaluationScore" JSONB NOT NULL,
ADD COLUMN     "programId" INTEGER NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "submissionData" JSONB NOT NULL,
ADD COLUMN     "submissionId" SERIAL NOT NULL,
ADD CONSTRAINT "StudentSubmission_pkey" PRIMARY KEY ("submissionId");

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("rulesetId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AttributeCategory"("categoryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "Rubric"("rubricId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricRuleset" ADD CONSTRAINT "RubricRuleset_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "Rubric"("rubricId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricRuleset" ADD CONSTRAINT "RubricRuleset_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("rulesetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogicalGroup" ADD CONSTRAINT "LogicalGroup_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("rulesetId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_logical_group_id_fkey" FOREIGN KEY ("logical_group_id") REFERENCES "LogicalGroup"("logical_group_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("rulesetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RulesetAttributeConfig" ADD CONSTRAINT "RulesetAttributeConfig_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("rulesetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RulesetAttributeConfig" ADD CONSTRAINT "RulesetAttributeConfig_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Attribute"("attributeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricSectionConfig" ADD CONSTRAINT "RubricSectionConfig_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "Rubric"("rubricId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricSectionConfig" ADD CONSTRAINT "RubricSectionConfig_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("rulesetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_studentSubmissionSubmissionId_fkey" FOREIGN KEY ("studentSubmissionSubmissionId") REFERENCES "StudentSubmission"("submissionId") ON DELETE SET NULL ON UPDATE CASCADE;
