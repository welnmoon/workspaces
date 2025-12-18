import { Badge } from '@/components/ui/badge';
import { Heading } from '@/components/ui/heading';
import { FcCollaboration } from 'react-icons/fc';
import HeroTariff from './hero-tariff';
import { RootStats } from '@/app/page';
import Stats from '../stats';

const NewHeroSection = ({ stats }: { stats: RootStats }) => {
  return (
    <section
      className={`py-10 
        flex flex-col lg:flex-row gap-8 
    `}
    >
      <h2 className="visually-hidden">Hero section</h2>
      {/*LEFT SIDE*/}
      <section className="flex flex-col justify-between border-r border-zinc-200 pr-8">
        {/* TEXT */}
        <div className="flex flex-col gap-2">
          <Badge className="w-fit text-[14px]" variant="info">
            <FcCollaboration className="mr-2" />
            Designed for collaborative work
          </Badge>

          <Heading className="text-6xl text-black">
            Control your team’s work in one workspace
          </Heading>

          <p className="text-[14px] text-zinc-600">
            Рабочие пространства для командной работы. Настраивайте доступы,
            роли и структуру под свои процессы, держите задачи и данные в одном
            месте и не теряйте контекст по мере роста команды.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="-mx-8 my-6 h-px bg-zinc-200" />

        {/* STATS */}
        <Stats stats={stats} />
      </section>

      {/*RIGHT SIDE*/}
      <HeroTariff />
      {/*BOTTOM*/}
    </section>
  );
};

export default NewHeroSection;
