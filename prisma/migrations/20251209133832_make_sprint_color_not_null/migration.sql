/*
  Warnings:

  - Made the column `color` on table `Sprint` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sprint" ALTER COLUMN "color" SET NOT NULL;
