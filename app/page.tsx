import Footer from '@/components/root/main/footer';
import Advantages from '@/components/root/main/advantages/advantages';
import { RootNavigationMenu } from '@/components/root/main/header/header';

import RootContainer from '@/components/root/root-container';
import FaqRoot from '@/components/root/main/faq/faq-root';
import NewHeroSection from '@/components/root/main/hero/new-hero';
import SmoothScrollProvider from '@/components/layout/Providers/SmoothScrollProvider';
import ShowCase from '@/components/root/main/show-case/show-case';
import Image from 'next/image';

export type RootStats = {
  workspaces: number;
  projects: number;
  tasks: number;
  users: number;
};

export const dynamic = 'force-dynamic';

async function Home() {
  // const [workspaces, projects, tasks, users] = await Promise.all([
  //   prisma.workspace.count(),
  //   prisma.project.count(),
  //   prisma.task.count(),
  //   prisma.user.count(),
  // ]);
  // const stats: RootStats = { workspaces, projects, tasks, users }; // вот здесь
  return (
    <main>
      <SmoothScrollProvider />
      <RootContainer size="md">
        <RootNavigationMenu />
        <NewHeroSection />{' '}
        {/*Здесь внутри еще есть компонент Stats и там используется stats*/}
      </RootContainer>

      <section className="bg-gray-100 pt-8 relative mb-8">
        <div className="w-[90%] md:w-[80%] lg:w-[70%] xl:w-[80%] mx-auto">
          <div className="bg-gradient-to-t from-white absolute z-10 inset-0" />
          <Image
            alt="product mockup"
            src="/images/kanban-page.png"
            width={1896}
            height={903}
            draggable={false}
            className="block w-full object-contain mx-auto rounded-t-lg select-none"
            sizes="(min-width: 1024px) 70vw, 90vw"
          />
        </div>
      </section>

      <RootContainer size="md" className="flex flex-col gap-20 mb-16">
        <Advantages />
        <ShowCase />
        <FaqRoot />
      </RootContainer>

      <Footer />
    </main>
  );
}

export default Home;
