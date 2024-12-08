/*
  Warnings:

  - The values [text] on the enum `AttributeType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `variant` on the `Attribute` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AttributeType_new" AS ENUM ('singleLinetext', 'multiLinetext', 'number', 'date', 'datetime', 'boolean', 'dropdown', 'multiselect', 'file', 'calculated');
ALTER TABLE "Attribute" ALTER COLUMN "type" TYPE "AttributeType_new" USING ("type"::text::"AttributeType_new");
ALTER TYPE "AttributeType" RENAME TO "AttributeType_old";
ALTER TYPE "AttributeType_new" RENAME TO "AttributeType";
DROP TYPE "AttributeType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "variant";

-- DropEnum
DROP TYPE "AttributeVariant";
