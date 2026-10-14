import {
  BecomeProvider,
  BiggerThanCamera,
  Categories,
  ClosingCta,
  Faq,
  Featured,
  Hero,
  PlannerTeaser,
  Steps,
} from "@/components/landing/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Featured />
      <Steps />
      <PlannerTeaser />
      <BecomeProvider />
      <BiggerThanCamera />
      <Faq />
      <ClosingCta />
    </>
  );
}
