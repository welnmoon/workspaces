import { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';
import { Role } from '@prisma/client';

export const RolesWithoutOwner: RoleWithoutOwnerDTO[] = [
  Role.ADMIN,
  Role.MEMBER,
];
