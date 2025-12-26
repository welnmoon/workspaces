import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tariffs } from '@/const/tariffs';
import { Button } from '@/components/ui/button';
import { clientRoutes } from '@/lib/routes/client-routes';

const tariff_tabs = Object.entries(tariffs).map((t) => {
  return {
    name: t[1].name,
    value: t[0],
    icon: t[1].icon,
    label: t[1].label,
  };
});

const TariffTabs = ({
  currentTariff,
  setCurrentTariff,
}: {
  currentTariff: string;
  setCurrentTariff: (tariff: string) => void;
}) => {
  return (
    <div className="text-right inset-shadow-sm py-4 px-4 md:px-4 rounded-md w-full mx flex gap-4 flex-col sm:flex-row sm:gap-0  items-center justify-between">
      <Button
        variant="link"
        asChild
        className="group order-2 md:order-1 gap-2 items-center"
      >
        <Link
          href={clientRoutes.pricingPage()}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          К тарифам
        </Link>
      </Button>
      <Tabs defaultValue={currentTariff} className="gap-4 order-1 md:order-2">
        <TabsList className="h-full">
          {tariff_tabs.map(({ icon: Icon, name, label, value }) => (
            <TabsTrigger
              key={value}
              value={name}
              onClick={() => setCurrentTariff(name)}
              className="flex flex-col items-center gap-1 px-4 md:px-6"
            >
              <Icon />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TariffTabs;
