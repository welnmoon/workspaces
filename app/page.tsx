'use client';

import { AuthButtons } from '@/components/root/buttons/auth-btns';
import Advantages from '@/components/root/main/advantages/advantages';
import HeroSection from '@/components/root/main/hero/hero';
import CompaniesMarquee from '@/components/root/main/marquee/companies-marquee';

import RootContainer from '@/components/root/root-container';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';

// export type SessionUser =
//   | {
//       id: string;
//       name?: string | null | undefined;
//       email?: string | null | undefined;
//       image?: string | null | undefined;
//     }
//   | undefined;

export default function Home() {
  // const user = useSession().data?.user;
  return (
    <main>
      <RootContainer>
        <header className="flex justify-between">
          <WorkspaceLogo />
          <AuthButtons />
        </header>

        {/*Hero*/}
        <HeroSection />
      </RootContainer>
      <CompaniesMarquee />

      {/*Product Mockup*/}
      <section className="bg-gray-100 pt-8 relative mb-8">
        {/*gradient from bottom to top*/}
        <div className="w-[60%] mx-auto">
          <div className="bg-gradient-to-t from-white absolute z-10 inset-0" />
          <img
            alt="product mockup"
            src="/images/dashboard-screen.webp"
            className="block w-full object-contain mx-auto rounded-t-lg"
          />
        </div>
      </section>

      {/*Advantages*/}
      <Advantages />
    </main>
  );
}
