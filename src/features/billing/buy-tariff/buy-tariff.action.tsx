import Link from 'next/link';
import { IndentIncrease } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { clientRoutes } from '@/lib/routes/client-routes';

const BuyTariffAction = () => {
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

export { BuyTariffAction };
