-- CreateTable
CREATE TABLE "Program" (
    "program_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "attachment_types" JSONB NOT NULL,
    "requirements" JSONB NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "Rubric" (
    "rubric_id" SERIAL NOT NULL,
    "program_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "max_weight" INTEGER NOT NULL,

    CONSTRAINT "Rubric_pkey" PRIMARY KEY ("rubric_id")
);

-- CreateTable
CREATE TABLE "Ruleset" (
    "ruleset_id" SERIAL NOT NULL,
    "rubric_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "max_weight" INTEGER NOT NULL,

    CONSTRAINT "Ruleset_pkey" PRIMARY KEY ("ruleset_id")
);

-- CreateTable
CREATE TABLE "LogicalGroup" (
    "logic_group_id" SERIAL NOT NULL,
    "ruleset_id" INTEGER NOT NULL,
    "parent_logic_group_id" INTEGER,
    "logic_operator" TEXT NOT NULL,

    CONSTRAINT "LogicalGroup_pkey" PRIMARY KEY ("logic_group_id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "rule_id" SERIAL NOT NULL,
    "logic_group_id" INTEGER,
    "attribute" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value_1" JSONB NOT NULL,
    "prompt" TEXT,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("rule_id")
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

-- AddForeignKey
ALTER TABLE "Rubric" ADD CONSTRAINT "Rubric_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "Rubric"("rubric_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogicalGroup" ADD CONSTRAINT "LogicalGroup_ruleset_id_fkey" FOREIGN KEY ("ruleset_id") REFERENCES "Ruleset"("ruleset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_logic_group_id_fkey" FOREIGN KEY ("logic_group_id") REFERENCES "LogicalGroup"("logic_group_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_studentSubmissionSubmission_id_fkey" FOREIGN KEY ("studentSubmissionSubmission_id") REFERENCES "StudentSubmission"("submission_id") ON DELETE SET NULL ON UPDATE CASCADE;
