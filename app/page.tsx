import Footer from '@/components/root/main/footer';
import Advantages from '@/components/root/main/advantages/advantages';
import { RootNavigationMenu } from '@/components/root/main/header/header';

import RootContainer from '@/components/root/root-container';
import FaqRoot from '@/components/root/main/faq/faq-root';
import NewHeroSection from '@/components/root/main/hero/new-hero';
import { apiRoutes } from '@/lib/routes/api-routes';
import SmoothScrollProvider from '@/components/layout/Providers/SmoothScrollProvider';
import ShowCase from '@/components/root/main/show-case/show-case';

export type RootStats = {
  workspaces: number;
  projects: number;
  tasks: number;
  users: number;
};

async function Home() {
  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${origin}${apiRoutes.getRootStats()}`, {
    method: 'GET',
    next: { revalidate: 300 },
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());

  const stats = res.data as RootStats;
  return (
    <main>
      <SmoothScrollProvider />
      <RootContainer size="md">
        <RootNavigationMenu />
        <NewHeroSection stats={stats} />
        {/* <HeroSection /> */}
        {/* <Stats stats={stats} /> */}
      </RootContainer>
      {/* <CompaniesMarquee /> */}

      {/*Product Mockup*/}
      <section className="bg-gray-100 pt-8 relative mb-8">
        <div className="w-[90%] md:w-[80%] lg:w-[70%] xl:w-[80%] mx-auto">
          <div className="bg-gradient-to-t from-white absolute z-10 inset-0" />
          <img
            alt="product mockup"
            src="/images/kanban-page.png"
            draggable={false}
            className="block w-full object-contain mx-auto rounded-t-lg select-none"
          />
        </div>
      </section>

      <RootContainer
        size="md"
        // className="sm:max-w-screen-sm
        //     md:max-w-screen-sm
        //     lg:max-w-screen-md
        //     xl:max-w-screen-xl
        //     2xl:max-w-screen-xl"
        className="flex flex-col gap-20 mb-16"
      >
        <Advantages />
        <ShowCase />
        <FaqRoot />
      </RootContainer>

      <Footer />
    </main>
  );
}

export default Home;
