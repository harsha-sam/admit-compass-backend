/*
  Warnings:

  - You are about to drop the column `display_name` on the `Attribute` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `Attribute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "display_name",
ADD COLUMN     "displayName" TEXT NOT NULL;
