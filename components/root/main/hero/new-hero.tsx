'use client';
import { Badge } from '@/components/ui/badge';
import { Heading } from '@/components/ui/heading';
import { FcCollaboration } from 'react-icons/fc';
import HeroTariff from './hero-tariff';
import { RootStats } from '@/app/page';
import Stats from '../stats';
import { useCountUp } from '@/hooks/use-count-up';
import { cn } from '@/lib/utils';

const logoWall = [
  { src: '/logos/logo-wall/Airbnb_Logo.svg', alt: 'Airbnb', className: 'w-30' },
  {
    src: '/logos/logo-wall/Halyk_Bank_logo.svg',
    alt: 'Halyk Bank',
    className: 'w-15',
  },
  {
    src: '/logos/logo-wall/Launch_Darkly_Logo.svg',
    alt: 'LaunchDarkly',
    className: 'w-15',
  },
  { src: '/logos/logo-wall/Olo_Logo.svg', alt: 'Olo', className: 'w-15' },
  {
    src: '/logos/logo-wall/ZoomInfo_Logo.svg',
    alt: 'ZoomInfo',
    className: 'w-15',
  },
  {
    src: '/logos/logo-wall/ido_Logo.jpeg',
    alt: 'ZoomInfo',
    className: 'w-15',
  },
];

const animatedValueClass = 'mt-1 text-5xl font-bold wrap-break-word';

const NewHeroSection = ({ stats }: { stats: RootStats }) => {
  const animatedValue = useCountUp({
    target: 497,
    decimals: 0,
    durationMs: 1000,
    start: 0,
  });
  return (
    <section
      className={`py-10 
        flex flex-col
    `}
    >
      <h2 className="visually-hidden">Hero section</h2>
      <div className="flex flex-col lg:flex-row gap-8 mb-0">
        {/*LEFT SIDE*/}
        <section className="flex flex-col justify-between border-r border-zinc-200 pb-8 pr-8">
          {/* TEXT */}
          <div className="flex flex-col gap-2">
            <Badge className="w-fit text-[14px]" variant="info">
              <FcCollaboration className="mr-2" />
              Создано для командной работы
            </Badge>

            <Heading className="text-6xl text-black">
              Управляйте работой команды в одном пространстве
            </Heading>

            <p className="text-[14px] text-zinc-600">
              Рабочие пространства для командной работы. Настраивайте доступы,
              роли и структуру под свои процессы, держите задачи и данные в
              одном месте и не теряйте контекст по мере роста команды.
            </p>
          </div>

          {/* DIVIDER */}
          <div className="-mx-8 my-6 h-px bg-zinc-200" />

          {/* STATS */}
          <Stats animatedValueClass={animatedValueClass} stats={stats} />
        </section>

        {/*RIGHT SIDE*/}
        <HeroTariff />
      </div>
      {/*BOTTOM*/}
      <section className="border flex flex-col gap-4 border-zinc-200 px-8 pt-4 pb-8 rounded-md">
        <span className="text-zinc-500 pointer-events-none select-none">
          Нам доверяют
        </span>
        <div className="flex flex-row gap-40 items-center">
          <span className={cn('text-amber-500', animatedValueClass)}>
            {animatedValue}+
          </span>
          <div className="flex flex-row justify-between flex-1">
            {logoWall.map((l) => (
              <img
                className={cn('pointer-events-none select-none', l.className)}
                draggable={false}
                src={l.src}
                title={l.alt}
                alt={l.alt}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default NewHeroSection;
