import { Membership, Prisma } from '@prisma/client';

export type MembershipFullDTO = Membership;

export type MembershipSelectUserDTO = Prisma.MembershipGetPayload<{
  include: {
    user: true;
  };
}>;
