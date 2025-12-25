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

export const ROLE_VALUES = ['MEMBER', 'OWNER', 'ADMIN'] as const;
export type RoleValueDTO = (typeof ROLE_VALUES)[number];

export const ROLE_EDITABLE_VALUES = ['ADMIN', 'MEMBER'] as const;
export type RoleEditableDTO = (typeof ROLE_EDITABLE_VALUES)[number];
