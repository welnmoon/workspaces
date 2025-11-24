// User DTO

import type { Prisma, User } from '@prisma/client';

export type UserDTO = User;

export type CreateUserDTO = Omit<UserDTO, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUserDTO = Partial<CreateUserDTO>;

export type UserWithoutDatesDTO = Omit<UserDTO, 'createdAt' | 'updatedAt'>;

export type UserWithoutDatesAndIdDTO = Omit<UserWithoutDatesDTO, 'id'>;

export type UserProfileDTO = Prisma.UserGetPayload<{
  include: {
    accounts: true;
    memberships: { include: { workspace: true } };
  };
}>;
