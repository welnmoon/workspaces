import { requireUser } from '@/helpers/require-user';
import ProfileComponent from '@/components/profile/profile';
import { UserService } from '@/lib/services/user';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  try {
    const { id } = await requireUser();

    const user = await UserService.getUserProfile(id);

    if (!id || !user) redirect(process.env.NEXT_PUBLIC_BASE_URL!);

    return <ProfileComponent userId={user.id} />;
  } catch {
    redirect(process.env.NEXT_PUBLIC_BASE_URL!);
  }
};

export default ProfilePage;
