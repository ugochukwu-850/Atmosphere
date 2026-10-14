import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import { themeScript } from "@/lib/theme/theme";

import { Providers } from "./providers";
import "./globals.css";

// Typefaces from the Figma file: Sora for headings, Manrope for everything else.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ArtMostSphere — The production ecosystem for Africa",
    template: "%s · ArtMostSphere",
  },
  description:
    "Locations. Gear. Cast. Planning. All in one production space. Starting in Nigeria.",
};

/**
 * Header and footer live in the route-group layouts: the landing page renders
 * its own nav inside the hero, auth pages are a focused split screen, every
 * other page uses <SiteHeader /> + <Footer />.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme is set by themeScript before paint, hence suppressHydrationWarning.
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${sora.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>
          <div className="flex flex-1 flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
