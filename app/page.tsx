import Footer from '@/components/root/main/footer';
import Advantages from '@/components/root/main/advantages/advantages';
import { RootNavigationMenu } from '@/components/root/main/header';

import RootContainer from '@/components/root/root-container';
import FaqRoot from '@/components/root/main/faq/faq-root';
import NewHeroSection from '@/components/root/main/hero/new-hero';
import { apiRoutes } from '@/lib/routes/api-routes';
import Stats from '@/components/root/main/stats';
import SmoothScrollProvider from '@/components/layout/Providers/SmoothScrollProvider';

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
        <div className="w-[60%] mx-auto">
          <div className="bg-gradient-to-t from-white absolute z-10 inset-0" />
          <img
            alt="product mockup"
            src="/images/dashboard-screen.webp"
            className="block w-full object-contain mx-auto rounded-t-lg"
          />
        </div>
      </section>

      <Advantages />
      <RootContainer
      // className="sm:max-w-screen-sm
      //     md:max-w-screen-sm
      //     lg:max-w-screen-md
      //     xl:max-w-screen-xl
      //     2xl:max-w-screen-xl"
      >
        <FaqRoot />
      </RootContainer>
      <Footer />
    </main>
  );
}

export default Home;
