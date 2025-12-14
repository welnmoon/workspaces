import { requireWorkspaceMember } from '@/guards/workspace';
import { requireUser } from '@/helpers/require-user';
import { validateId } from '@/helpers/validate-id';
import { handleApiError } from '@/lib/http/handle-api-error';
import { ok } from '@/lib/http/http';
import { AuditLogService } from '@/lib/services/audit-log';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    await requireUser();
    const wId = validateId((await params).workspaceId);
    await requireWorkspaceMember({
      workspaceId: wId,
      allowed: ['OWNER', 'ADMIN'],
    });
    const limitParam = Number(req.nextUrl.searchParams.get('limit'));
    const limit = Number.isFinite(limitParam) ? limitParam : 100;

    const auditLogs = await AuditLogService.getWorkspaceLogs(wId, limit);
    return ok(auditLogs);
  } catch (e) {
    return handleApiError(e);
  }
}
