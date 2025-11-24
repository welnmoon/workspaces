// types/prisma/DTO/role.ts

export type FullRoleDTO = 'MEMBER' | 'OWNER' | 'ADMIN';

export type RoleWithoutOwnerDTO = Exclude<FullRoleDTO, 'OWNER'>;

// если хочешь enum-подобную штуку:
export const RolesEnum = {
  MEMBER: 'MEMBER',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
} as const;

export type RolesEnum = (typeof RolesEnum)[keyof typeof RolesEnum];
