'use client';

import Footer from '@/components/root/main/footer';
import Advantages from '@/components/root/main/advantages/advantages';
import { RootNavigationMenu } from '@/components/root/main/header';
import HeroSection from '@/components/root/main/hero/hero';
import CompaniesMarquee from '@/components/root/main/marquee/companies-marquee';

import RootContainer from '@/components/root/root-container';
import FAQ from '@/components/root/main/faq/faq';

export default function Home() {
  return (
    <main>
      <RootContainer>
        <RootNavigationMenu />

        <HeroSection />
      </RootContainer>
      <CompaniesMarquee />

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
        <FAQ />
      </RootContainer>
      <Footer />
    </main>
  );
}
