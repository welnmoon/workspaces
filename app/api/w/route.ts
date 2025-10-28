import { requireUser } from '@/helpers/require-user';
import prisma from '@/lib/prisma';
import { createWorkspaceFormSchema } from '@/schemas/workspace/create-workspace-form-schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id } = await requireUser();
    const body = await req.json();
    const res = createWorkspaceFormSchema.safeParse(body);
    if (!res.success) return new Response(res.error.message, { status: 400 });

    await prisma.workspace.create({
      data: {
        name: res.data.name,
        description: res.data.description,
      },
    });

    return NextResponse.json({ name: w.name }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    );
  }
}
