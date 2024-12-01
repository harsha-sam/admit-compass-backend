/*
  Warnings:

  - You are about to drop the `_ReferencedAttributes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ReferencedAttributes" DROP CONSTRAINT "_ReferencedAttributes_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReferencedAttributes" DROP CONSTRAINT "_ReferencedAttributes_B_fkey";

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "options" JSONB;

-- DropTable
DROP TABLE "_ReferencedAttributes";
