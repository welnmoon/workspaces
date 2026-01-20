  
           

                                                                                                                   
                                                                                                                
                                                                                                                               

  
                 
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

                 
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_workspaceId_fkey";

            
DROP INDEX "Payment_workspaceId_idx";

            
DROP INDEX "Payment_workspaceId_paidAt_idx";

             
ALTER TABLE "Payment" DROP COLUMN "workspaceId",
ALTER COLUMN "userId" SET NOT NULL;

             
ALTER TABLE "Workspace" DROP COLUMN "tariff";

              
CREATE INDEX "Payment_userId_paidAt_idx" ON "Payment"("userId", "paidAt");

                
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
