import { requireUser } from '@/helpers/require-user';
import { ok, serverError } from '@/lib/http/http';
import { WorkspaceService } from '@/lib/services/workspace';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // await requireUser();
    const { id } = await requireUser();
    const workspaces = await WorkspaceService.getList(id);
    const res = ok(workspaces);
    res.headers.set('Access-Control-Allow-Origin', 'https://workspaces-nyvc.vercel.app');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Vary', 'Origin');
    return res;
  } catch (e) {
    console.error(e);
    return serverError('Failed to get workspaces');
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://workspaces-nyvc.vercel.app',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    },
  });
}
