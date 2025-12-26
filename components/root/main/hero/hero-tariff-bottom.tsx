import { tariffBottomCards } from '@/const/tariffs';
import clsx from 'clsx';

type TariffKey = keyof typeof tariffBottomCards;

const colorMap: Record<TariffKey, string> = {
  FREE: 'sm:bg-neutral-50 sm:border-neutral-200 text-neutral-700',
  PRO: 'sm:bg-amber-50 sm:border-amber-200 text-amber-700',
  BUSINESS: 'sm:bg-red-50 sm:border-red-200 text-red-700',
};

const HeroTariffBottom = ({ currentTariff }: { currentTariff: TariffKey }) => {
  const cards = tariffBottomCards[currentTariff];

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4 text-sm">
        {cards.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className={clsx(
              'sm:rounded-lg sm:border px-2 sm:px-4 sm:py-4 flex flex-col md:flex-row lg:flex-col items-start gap-3',
              colorMap[currentTariff]
            )}
          >
            <Icon className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-neutral-900">{title}</p>
              <p className="mt-1 leading-snug">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroTariffBottom;
