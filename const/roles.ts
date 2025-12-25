import { RoleWithoutOwnerDTO, RolesEnum } from '@/types/prisma/DTO/role';

export const RolesWithoutOwner: RoleWithoutOwnerDTO[] = [
  RolesEnum.ADMIN,
  RolesEnum.MEMBER,
];
