export interface LoginParams {
  reason?: 'session-expired' | 'unauthorized' | 'forbidden' | 'logged-out';
  from?: string;
}
