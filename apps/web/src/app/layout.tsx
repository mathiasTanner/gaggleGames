import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getMediaUrl } from "@/lib/strapi/media";
import { getSiteSettings } from "@/lib/strapi/siteSettings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const faviconUrl = getMediaUrl(siteSettings.favicon?.url);

  return {
    title: siteSettings.defaultSeoTitle,
    description: siteSettings.defaultSeoDescription,
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function () {
            try {
              var stored = localStorage.getItem('theme');
              var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
              var useDark = stored ? stored === 'dark' : prefersDark;
              var root = document.documentElement;
              if (useDark) root.classList.add('dark');
              else root.classList.remove('dark');
            } catch (e) {}
          })();
          `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-dvh flex-col antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
