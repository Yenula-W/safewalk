import type { Metadata } from "next";
import { Big_Shoulders, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["700", "900"],
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
