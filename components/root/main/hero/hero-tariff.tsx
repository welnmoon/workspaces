'use client';

import { useState } from 'react';
import TariffTabs from './tariff-tabs';
import { tariffs } from '@/const/tariffs';
import HeroTariffTop from './hero-tariff-top';
import HeroTariffBottom from './hero-tariff-bottom';

type TariffKey = keyof typeof tariffs;

const HeroTariff = () => {
  const [currentTariff, setCurrentTariff] = useState<TariffKey>(
    tariffs.FREE.name
  );

  return (
    <section className="w-full flex items-center flex-col gap-4">
      <h2 className="visually-hidden p-4">Tariffs</h2>

      <HeroTariffTop currentTariff={currentTariff} />

      <TariffTabs
        currentTariff={currentTariff}
        setCurrentTariff={setCurrentTariff}
      />

      <HeroTariffBottom currentTariff={currentTariff} />
    </section>
  );
};

export default HeroTariff;
