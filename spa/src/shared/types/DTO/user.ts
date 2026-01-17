import type { Tariffs } from '../tariff';

export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  wasOnline: string | null;
}

export interface UserFullDTO {
  id: string;
  email: string | null;
  lastName: string | null;
  firstName: string | null;
  image: string | null;
  emailVerified: Date | null;
  avatarUrl: string | null;
  // password: string | null;
  currentTariff: Tariffs;
  createdAt: Date;
  updatedAt: Date;
  wasOnline: Date | null;
  nickname: string | null;
  platformRole: 'USER' | 'SYSADMIN';
}
