import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { themeScript } from "@/lib/theme/theme";

import { Providers } from "./providers";
import "./globals.css";

// Heading face approximated from Figma; confirm on the Componet page.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ArtMostSphere — Africa's production OS",
    template: "%s · ArtMostSphere",
  },
  description:
    "Find locations, rent kit, hire creatives and keep a booking record. Starting in Nigeria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme is set by themeScript before paint, hence suppressHydrationWarning.
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${bricolage.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
