import { SiteFooter } from '../components/layout/SiteFooter';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SkipLink } from '../components/layout/SkipLink';
import { Features } from '../components/marketing/Features';
import { Hero } from '../components/marketing/Hero';
import { HowItWorks } from '../components/marketing/HowItWorks';
import { Pricing } from '../components/marketing/Pricing';
import { TrustBar } from '../components/marketing/TrustBar';

/**
 * The landing page is a server component now.
 *
 * It was one 382-line client component: every section, all its copy and all
 * its markup were shipped to the browser and hydrated because a few children
 * needed scroll animation. Only those children carry 'use client', so the
 * static sections render on the server and stay out of the JS bundle.
 */
export default function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
      <SiteFooter />
    </>
  );
}
