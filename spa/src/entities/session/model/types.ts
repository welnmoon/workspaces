export type PlatformRole = 'USER' | 'SYSADMIN';

export interface User {
  id: string;
  name: string;
  platformRole: PlatformRole;
}
export interface Session {
  user: User;
}
