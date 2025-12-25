import type { Invitation, Prisma } from '@prisma/client';

export type InvitationDTO = Invitation;

export type ReceivedInvitationDTO = Prisma.InvitationGetPayload<{
  include: {
    workspace: {
      select: {
        name: true;
      };
    };
    inviter: {
      select: {
        firstName: true;
        lastName: true;
        email: true;
      };
    };
  };
}>;
