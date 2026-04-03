import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { Demo } from '../components/Demo';
import { UseCases } from '../components/UseCases';
import { Pricing } from '../components/Pricing';
import { OpenSource } from '../components/OpenSource';

export function Landing() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Demo />
      <UseCases />
      <Pricing />
      <OpenSource />
    </>
  );
}
