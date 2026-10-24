import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-host the existing Latin fonts so CI builds do not depend on Google Fonts.
const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/geist-mono.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});
const bigShoulders = localFont({
  src: "./fonts/big-shoulders.woff2",
  variable: "--font-big-shoulders",
  weight: "700 900",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "SafeWalk — Know the walk before you take it",
  description:
    "Students in Cypress, TX flag dark corners, missing sidewalks and bad crossings. SafeWalk turns their reports into a route score anyone can check.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${geistMono.variable} ${bigShoulders.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
