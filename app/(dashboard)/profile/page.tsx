import { Breadcrumbs } from '@/components/bread-crumbs';
import ProfileComponent from '@/components/profile/profile';
import { requireUser } from '@/guards/require-user';
import { clientRoutes } from '@/lib/routes/client-routes';
import { UserService } from '@/lib/services/user';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspaces',
  description: "Manage your team's work in one space",
  icons: {
    icon: '/icons/metadata/w.png',
  },
};

const ProfilePage = async () => {
  try {
    const { id } = await requireUser();
    const user = await UserService.getUserProfile(id);

    if (!id || !user) redirect(process.env.NEXT_PUBLIC_BASE_URL!);

    return (
      <main className="flex flex-col gap-4">
        <Breadcrumbs
          items={[
            { label: 'Workspaces', href: clientRoutes.workspacesPage() },
            { label: 'Profile' },
          ]}
        />
        <ProfileComponent userId={user.id} />
      </main>
    );
  } catch {
    redirect(process.env.NEXT_PUBLIC_BASE_URL!);
  }
};

export default ProfilePage;
