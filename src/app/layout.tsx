import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({ 
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: '--font-cormorant'
});

const dmSans = DM_Sans({ 
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: '--font-dm-sans'
});

export const metadata: Metadata = {
  title: "Premium Wall Calendar",
  description: "Phase 1: Base Layout & Calendar Shell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}