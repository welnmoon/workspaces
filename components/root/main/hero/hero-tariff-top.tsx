import { BorderBeam } from '@/components/ui/border-beam';
import { tariffs } from '@/const/tariffs';
import Image from 'next/image';

type TariffKey = keyof typeof tariffs;

const HeroTariffTop = ({ currentTariff }: { currentTariff: TariffKey }) => {
  return (
    <div className="min-h-fit h-[350px] h-max-[360px] w-full">
      {currentTariff === tariffs.FREE.name && (
        <div className="flex justify-between h-full gap-4">
          <div className="bg-neutral-100 border border-zinc-200 w-1/2 rounded-md relative">
            <p className="font-[600] text-neutral-700 my-4 mx-6 wrap-break-word text-lg">
              Подходит для старта
            </p>
            <div className="absolute bottom-0 h-[50%] md:h-[80%] lg:h-[70%] w-full relative">
              <Image
                src="/images/hero/hero-free-1_cropped.avif"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="bg-neutral-50 border border-zinc-200 w-1/2 rounded-md py-4 px-6 text-sm text-neutral-600">
            <p className="md:text-[20px] text-[16px]  font-semibold">
              Ограничения:
            </p>
            <ul className="mt-2 list-inside list-none space-y-2">
              {tariffs.FREE.features.map((f) => (
                <li key={f.label}>
                  <f.icon className="w-4 h-4 mr-2 inline text-amber-600" />
                  <span className="text-[12px] md:text-[16px]">{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {currentTariff === tariffs.PRO.name && (
        <div className="flex justify-between h-full gap-4">
          <div className="bg-amber-100 border border-amber-200 w-1/2 rounded-md relative">
            <p className="font-[600] text-neutral-800 my-4 mx-6 wrap-break-word text-lg">
              Для небольших команд
            </p>
            <div className="absolute bottom-0 h-[50%] md:h-[70%] lg:h-[50%] w-full relative">
              <Image
                src="/images/hero/hero-pro-1_cropped.avif"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 w-1/2 rounded-md py-4 px-6 text-sm text-neutral-700 flex flex-col justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-semibold">Возможности:</h2>
              <ul className="mt-2 list-inside list-none space-y-2">
                {tariffs.PRO.features.map((f) => (
                  <li key={f.label}>
                    <f.icon className="w-4 h-4 mr-2 inline text-amber-600" />
                    <span className="text-[12px] md:text-[16px]">
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="mt-4 block font-normal text-xl">
              {tariffs.PRO.amount} {tariffs.PRO.currency} / месяц
            </span>
          </div>
        </div>
      )}

      {currentTariff === tariffs.BUSINESS.name && (
        <div className="flex justify-between h-full gap-4">
          <div className="bg-red-100 w-1/2 rounded-md relative">
            <p className="font-[600] text-neutral-800 my-4 mx-6 text-lg">
              Для компаний и отделов
            </p>
            <div className="absolute bottom-0 h-[50%] md:h-[80%] lg:h-[70%] w-full relative">
              <Image
                src="/images/hero/hero-business-1_cropped.avif"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="bg-red-50 w-1/2 rounded-md py-4 px-6 text-sm text-neutral-700 flex flex-col justify-between relative overflow-hidden">
            <div>
              <h2 className="md:text-[20px] text-[14px]  font-semibold">
                Дополнительно:
              </h2>
              <ul className="mt-2 list-inside list-none space-y-2">
                {tariffs.BUSINESS.features.map((f) => (
                  <li key={f.label}>
                    <f.icon className="w-4 h-4 mr-2 inline text-red-600" />
                    <span className="text-[12px] md:text-[16px]">
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="mt-4 block font-normal text-xl">
              {tariffs.BUSINESS.amount} {tariffs.BUSINESS.currency} / месяц
            </span>
            <BorderBeam
              duration={4}
              size={300}
              reverse
              className="from-transparent via-red-400 to-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroTariffTop;
