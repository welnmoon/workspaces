import UnAuth from '@/components/profile/un-auth';
import { requireUser } from '@/helpers/require-user';
import ProfileComponent from '@/components/profile/profile';
import { UserService } from '@/lib/services/user';

const ProfilePage = async () => {
  const { id } = await requireUser();

  const user = await UserService.getUserProfile(id);

  if (!user) {
    return <UnAuth />;
  }

  return <ProfileComponent user={user} />;
};

export default ProfilePage;
