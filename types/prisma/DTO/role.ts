import { Role } from '@prisma/client';

export type FullRoleDTO = Role;

export type RoleWithoutOwnerDTO = Exclude<Role, 'OWNER'>;
