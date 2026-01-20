            
DROP INDEX "public"."Invitation_workspaceId_invitedUserEmail_key";

             
ALTER TABLE "AuditLog" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "entityId" SET DATA TYPE TEXT;

             
ALTER TABLE "User" ADD COLUMN     "nickname" TEXT;

             
ALTER TABLE "Workspace" ADD COLUMN     "ownerId" TEXT;

              
CREATE INDEX "Task_projectId_priority_idx" ON "Task"("projectId", "priority");

                
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
