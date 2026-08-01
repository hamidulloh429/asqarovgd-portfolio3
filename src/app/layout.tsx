import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import { prisma } from "@/lib/prisma";

// Content (settings, projects, media) is edited live from the Admin Panel,
// so pages must always fetch fresh data instead of using a build-time
// snapshot. Without this, changes only appear after a full redeploy.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings
    .findUnique({ where: { id: "singleton" } })
    .catch(() => null);

  const title = settings?.siteTitle || "ASQAROVGD";
  const description =
    settings?.heroSubtitle ||
    "Graphic Designer, Motion Designer & Video Editor.";

  return {
    title: { default: title, template: `%s — ${title}` },
    description,
    icons: settings?.faviconUrl ? [{ url: settings.faviconUrl }] : undefined,
    openGraph: {
      title,
      description,
      images: settings?.logoUrl ? [settings.logoUrl] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSettings
    .findUnique({ where: { id: "singleton" } })
    .catch(() => null);

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <RevealObserver />
        <ScrollProgress />
        <CustomCursor />
        <Header
          siteTitle={settings?.siteTitle || "ASQAROVGD"}
          logoUrl={settings?.logoUrl || null}
        />
        <main className="min-h-[70vh]">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
