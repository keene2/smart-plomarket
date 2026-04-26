import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans_SC } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Geist loaded via CDN in globals.css @theme font-family.
// Inter as fallback for next/font optimization.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ORACLE — Smart Polymarket",
  description: "Polymarket smart money analytics and trading",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${notoSansSC.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link href="https://fonts.cdnfonts.com/css/geist" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/geist-mono" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
