import NotificationsClient from '@/components/entities/notifications/notifications-client';
import { requireUser } from '@/helpers/require-user';
import { NotificationService } from '@/lib/services/notifications';
import { Breadcrumbs } from '@/components/bread-crumbs';
import { clientRoutes } from '@/lib/routes/client-routes';
import { Heading } from '@/components/ui/heading';
import Footer from '@/components/root/main/footer';

const NotificationsPage = async () => {
  const { id } = await requireUser();
  const notifications = await NotificationService.getNotifications(id);

  return (
    <main className="flex flex-col gap-6 py-6">
      <Breadcrumbs
        items={[
          { label: 'Профиль', href: clientRoutes.profilePage() },
          { label: 'Уведомления', href: clientRoutes.notificationsPage() },
        ]}
      />

      <section className="flex flex-col gap-2">
        <Heading>Уведомления</Heading>
        <p className="text-sm text-muted-foreground">
          Управляйте приглашениями, обновлениями и важными событиями в ваших
          пространствах.
        </p>
      </section>

      <NotificationsClient notifications={notifications} userId={id} />
      <Footer />
    </main>
  );
};

export default NotificationsPage;
