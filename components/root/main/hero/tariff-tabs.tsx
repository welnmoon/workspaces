import { ArrowLeftIcon } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tariffs } from '@/const/tariffs';
import { Button } from '@/components/ui/button';

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
    <div className="text-right inset-shadow-sm py-4 px-4 md:px-4 rounded-md w-full mx flex flex-row  items-center justify-between">
      <Button variant="ghost" className="group order-2 md:order-1">
        <ArrowLeftIcon className="transition-transform duration-200 group-hover:-translate-x-0.5" />
        К тарифам
      </Button>
      <Tabs defaultValue={currentTariff} className="gap-4 order-1 md:order-2">
        <TabsList className="h-full">
          {tariff_tabs.map(({ icon: Icon, name, label, value }) => (
            <TabsTrigger
              key={value}
              value={name}
              onClick={() => setCurrentTariff(name)}
              className="flex flex-col items-center gap-1 px-6 sm:px-4"
            >
              <Icon />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* {tariff_tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <p className="text-muted-foreground text-sm">{tab.name}</p>
          </TabsContent>
        ))} */}
      </Tabs>
    </div>
  );
};

export default TariffTabs;
