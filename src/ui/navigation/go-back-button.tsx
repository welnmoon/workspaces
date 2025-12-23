import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { Button } from '@/components/ui/button';

type GoBackButtonProps = { router: AppRouterInstance };

const GoBackButton = ({ router }: GoBackButtonProps) => {
  return <Button onClick={() => router.back()}>Назад</Button>;
};

export default GoBackButton;
export { GoBackButton, type GoBackButtonProps };
