/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `tariff` on the `Workspace` table. All the data in the column will be lost.
  - Made the column `userId` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_workspaceId_fkey";

-- DropIndex
DROP INDEX "Payment_workspaceId_idx";

-- DropIndex
DROP INDEX "Payment_workspaceId_paidAt_idx";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "workspaceId",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "tariff";

-- CreateIndex
CREATE INDEX "Payment_userId_paidAt_idx" ON "Payment"("userId", "paidAt");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
