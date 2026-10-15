import { About } from "@/components/landing/About";
import { ClosingCta } from "@/components/landing/ClosingCta";
import { Faq } from "@/components/landing/Faq";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LookingFor } from "@/components/landing/LookingFor";
import { Offer } from "@/components/landing/Offer";
import { PlannerPreview } from "@/components/landing/PlannerPreview";
import { Provider } from "@/components/landing/Provider";

/** Landing page, section order as in the Figma "Landing Page" frame. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <LookingFor />
      <Offer />
      <HowItWorks />
      <PlannerPreview />
      <Provider />
      <About />
      <Faq />
      <ClosingCta />
    </>
  );
}
