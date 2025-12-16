import { BookIcon, GiftIcon, HeartIcon } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tariffs } from '@/const/tariffs';

const tariff_tabs = Object.entries(tariffs).map((t) => {
  return {
    name: t[1].name,
    value: t[0],
    icon: t[1].icon,
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
    <div className="w-full text-right inset-shadow-sm py-4 px-2 rounded-md max-w-md">
      <Tabs defaultValue={currentTariff} className="gap-4">
        <TabsList className="h-full">
          {tariff_tabs.map(({ icon: Icon, name, value }) => (
            <TabsTrigger
              key={value}
              value={value}
              onClick={() => setCurrentTariff(name)}
              className="flex flex-col items-center gap-1 px-2.5 sm:px-3"
            >
              <Icon />
              {name}
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
