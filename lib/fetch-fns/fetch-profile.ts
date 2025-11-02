import { apiRoutes } from '@/lib/routes/api-routes';
import { profileSchema } from '@/schemas/profile/profile';
import { UserDTO } from '@/types/prisma/DTO/user';

type FetchProfileProps = {
  userId: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
};

export const fetchProfile = async ({
  userId,
  method = 'GET',
  body,
}: FetchProfileProps): Promise<Partial<UserDTO> | null> => {
  try {
    let payload: unknown = undefined;

    if (method !== 'GET' && body !== undefined) {
      const result = profileSchema.safeParse(body);
      if (!result.success) {
        throw new Error('Profile payload validation failed');
      }
      payload = result.data;
    }

    const res = await fetch(apiRoutes.getUser(userId), {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }

    const json = (await res.json()) as { data?: Partial<UserDTO> | null };

    return json.data ?? null;
  } catch (e) {
    console.error('Error fetching profile', e);
    throw e;
  }
};
