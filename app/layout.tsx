import type { Metadata } from "next";
import { Big_Shoulders, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Font Configurations
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-big-shoulders",
  weight: ["400", "700", "900"],
});

const ibmSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-sans",
  weight: ["400", "500", "600"],
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Forge | Build Your Iron",
  description: "Next-generation gym tracking and community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${bigShoulders.variable} ${ibmSans.variable} ${ibmMono.variable} scroll-smooth`}
    >
      <body className="flex min-h-screen flex-col bg-iron font-sans text-chalk antialiased selection:bg-plate selection:text-chalk">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}