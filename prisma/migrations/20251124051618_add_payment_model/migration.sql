             
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

              
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "userId" TEXT,
    "tariff" "Tariff" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KZT',
    "cloudpaymentsId" TEXT,
    "invoiceId" TEXT,
    "status" "PaymentStatus" NOT NULL,
    "reason" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isSubscription" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionId" TEXT,
    "validUntil" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

              
CREATE INDEX "Payment_workspaceId_idx" ON "Payment"("workspaceId");

              
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

              
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

              
CREATE INDEX "Payment_paidAt_idx" ON "Payment"("paidAt");

              
CREATE INDEX "Payment_workspaceId_paidAt_idx" ON "Payment"("workspaceId", "paidAt");

              
CREATE INDEX "Payment_cloudpaymentsId_idx" ON "Payment"("cloudpaymentsId");

                
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

                
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
