import type { Metadata } from "next";
import { DM_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono-custom",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-custom",
});

export const metadata: Metadata = {
  title: "GistMe | Chat without limits",
  description: "Real conversations. Real people. Just you and your people — anytime, anywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmMono.variable} ${instrumentSerif.variable} font-mono-custom bg-[#faf9f7] text-[#201f1e] antialiased`}>
        {children}
      </body>
    </html>
  );
}
