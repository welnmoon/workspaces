import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Button } from '../ui/button';

const GoBackButton = ({ router }: { router: AppRouterInstance }) => {
  return <Button onClick={() => router.back()}>Назад</Button>;
};

export default GoBackButton;
