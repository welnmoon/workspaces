const DEV_FALLBACK_SECRET = 'development-only-nextauth-secret';
const MISSING_SECRET_MESSAGE =
  'NEXTAUTH_SECRET is not set. Add it to your environment variables.';

const resolveNextAuthSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(MISSING_SECRET_MESSAGE);
  }

  console.warn(
    `${MISSING_SECRET_MESSAGE} Falling back to a development-only secret.`
  );

  return DEV_FALLBACK_SECRET;
};

export const NEXT_AUTH_SECRET = resolveNextAuthSecret();
