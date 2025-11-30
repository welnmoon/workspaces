import {
  FaHouse,
  FaUser,
  FaGear,
  FaListCheck,
  FaBell,
  FaCircleQuestion,
} from 'react-icons/fa6';
import { clientRoutes } from '@/lib/routes/client-routes';

export const NAV_LINKS = [
  { label: 'Главная', href: '/', icon: FaHouse },
  { label: 'Профиль', href: clientRoutes.profilePage(), icon: FaUser },
  { label: 'Настройки', href: '/settings', icon: FaGear },
  {
    label: 'Мои задачи',
    href: clientRoutes.workspacesPage(),
    icon: FaListCheck,
  },
  { label: 'Активность', href: clientRoutes.notificationsPage(), icon: FaBell },
  { label: 'FAQ', href: '/faq', icon: FaCircleQuestion },
] as const;
