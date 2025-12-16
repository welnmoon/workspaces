import { AuditActions, AuditLog, Prisma } from '@prisma/client';

export type AuditActionsType = AuditActions;

export type AuditFull = AuditLog;

export type AuditWithUser = Prisma.AuditLogGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
      };
    };
  };
}>;
