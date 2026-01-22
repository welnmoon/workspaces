import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generate } from '@pdfme/generator';
import { BLANK_A4_PDF } from '@pdfme/common';
import type { Template, Schema } from '@pdfme/common';
import { table, text } from '@pdfme/schemas';
import { requireUser } from '@/guards/require-user';

export async function POST(request: Request) {
  const session = await requireUser();

  const { startDate, endDate } = await request.json();

  const start = new Date(startDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setUTCHours(23, 59, 59, 999);

  const tasks = await prisma.task.findMany({
    where: {
      status: 'DONE',
      updatedAt: { gte: start, lte: end },
      project: {
        workspace: {
          memberships: { some: { userId: session.id } },
        },
      },
    },
    include: {
      project: {
        select: {
          name: true,
          workspace: { select: { name: true } },
        },
      },
      assignee: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const period = `Период: ${new Date(startDate).toLocaleDateString(
    'ru-RU'
  )} — ${new Date(endDate).toLocaleDateString('ru-RU')}`;

  const tableBody = tasks.map((task) => {
    const assigneeName = task.assignee
      ? `${task.assignee.firstName || ''} ${task.assignee.lastName || ''}`.trim() ||
        'Без имени'
      : 'Не назначен';

    return [
      task.project.workspace.name,
      task.project.name,
      task.title,
      assigneeName,
      task.dueDate ? new Date(task.dueDate).toLocaleDateString('ru-RU') : '—',
      new Date(task.updatedAt).toLocaleDateString('ru-RU'),
      '—',
    ];
  });

  const tableHead = [
    'Воркспейс',
    'Проект',
    'Задача',
    'Исполнитель',
    'Дедлайн',
    'Завершено',
    'Затрачено времени',
  ];

  const template: Template = {
    basePdf: BLANK_A4_PDF,
    schemas: [
      [
        {
          name: 'title',
          type: 'text',
          content: 'Отчёт по завершённым задачам',
          position: { x: 0, y: 18 },
          width: 210,
          height: 20,
          alignment: 'center',
          fontSize: 22,
          fontColor: '#1e40af',
        } satisfies Schema,
        {
          name: 'period',
          type: 'text',
          content: period,
          position: { x: 0, y: 38 },
          width: 210,
          height: 12,
          alignment: 'center',
          fontSize: 13,
          fontColor: '#4b5563',
        } satisfies Schema,
        {
          name: 'tasksTable',
          type: 'table',
          position: { x: 8, y: 55 },
          width: 194,
          height: 235,
          showHead: true,
          repeatHead: true,
          head: tableHead,
          headWidthPercentages: [15, 15, 24, 14, 10, 10, 12],
          tableStyles: {
            borderWidth: 0.4,
            borderColor: '#d1d5db',
          },
          headStyles: {
            alignment: 'center',
            verticalAlignment: 'middle',
            fontSize: 10,
            lineHeight: 1.2,
            characterSpacing: 0,
            fontColor: '#ffffff',
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            borderWidth: { top: 0, right: 0, bottom: 0, left: 0 },
            padding: { top: 6, right: 6, bottom: 6, left: 6 },
          },
          bodyStyles: {
            alignment: 'left',
            verticalAlignment: 'middle',
            fontSize: 9.5,
            lineHeight: 1.3,
            characterSpacing: 0,
            fontColor: '#111827',
            backgroundColor: '#ffffff',
            alternateBackgroundColor: '#f9fafb',
            borderColor: '#e5e7eb',
            borderWidth: { top: 0.4, right: 0.4, bottom: 0.4, left: 0.4 },
            padding: { top: 5, right: 6, bottom: 5, left: 6 },
          },
          columnStyles: {
            alignment: {
              4: 'center',
              5: 'center',
              6: 'center',
            },
          },
          content: JSON.stringify(tableBody),
        } satisfies Schema,
      ],
    ],
  };

  const plugins = { table, text };

  try {
    const pdf = await generate({
      template,
      inputs: [{ tasksTable: tableBody }],
      plugins,
    });

    const formatDateForFile = (date: Date) => date.toISOString().slice(0, 10);
    const filename = `tasks_report_${formatDateForFile(start)}_to_${formatDateForFile(end)}.pdf`;

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
    return new NextResponse('Не удалось создать отчёт', { status: 500 });
  }
}
