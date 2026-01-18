import { corsHeaders, withCors } from '@/helpers/with-cors';
import { requireUser } from '@/helpers/require-user';
import { ok, serverError } from '@/lib/http/http';
import { WorkspaceService } from '@/lib/services/workspace';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // await requireUser();
    const { id } = await requireUser();
    const workspaces = await WorkspaceService.getList(id);
    return withCors(ok(workspaces), req.headers.get('origin'));
  } catch (e) {
    console.error(e);
    return withCors(
      serverError('Failed to get workspaces'),
      req.headers.get('origin')
    );
  }
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
