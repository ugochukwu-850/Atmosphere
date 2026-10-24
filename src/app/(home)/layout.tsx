import { Footer } from "@/components/layout/Footer";

// The landing page renders its own nav inside the hero photo card.
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
