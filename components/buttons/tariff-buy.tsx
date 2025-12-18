import { IndentIncrease } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { clientRoutes } from '@/lib/routes/client-routes';

const BuyTariffButton = () => {
  return (
    <Link href={clientRoutes.pricingPage()}>
      <Button
        variant="ghost"
        className={'w-full flex items-center justify-start gap-2 text-left'}
      >
        <IndentIncrease className="w-5 h-5" />
        <span>Обновить план</span>
      </Button>
    </Link>
  );
};

export default BuyTariffButton;
