import crypto from 'crypto';

export function generateToken(length = 32) {
  // генерирует криптографически случайные байты и делает их безопасными для URL
  return crypto.randomBytes(length).toString('base64url');
}
