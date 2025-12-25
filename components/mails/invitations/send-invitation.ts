import { resend } from '@/lib/email/resend-client';

export async function sendInviteEmail({
  to,
  workspaceName,
  token,
}: {
  to: string;
  workspaceName: string;
  token: string;
}) {
  const url = `${process.env.APP_URL}/invite/${token}`;
  await resend.emails.send({
    from: 'Your App <no-reply@yourdomain.com>',
    to,
    subject: `Приглашение в «${workspaceName}»`,
    html: `
      <p>Вас пригласили в рабочее пространство <b>${workspaceName}</b>.</p>
      <p><a href="${url}">Принять приглашение</a></p>
      <p>Ссылка одноразовая и имеет срок действия.</p>
    `,
  });
}
