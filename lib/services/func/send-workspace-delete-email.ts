import { resend } from "@/lib/email/resend-client";

// lib/mailer.ts
export async function sendWorkspaceDeletedEmail(params: {
  email: string;
  workspaceName: string;
}) {
  const { email, workspaceName } = params;


}
