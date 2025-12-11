import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const interSans = Inter_Tight({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sarah Paluszny - Travel",
  description: "A collection of photographs, I’ve attained while traveling the world",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📍</text></svg>"
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={`${geistSans.variable} ${geistMono.variable} ${interSans.variable} antialiased`}>
          {/* Sidebar */}
          <div className="hidden md:block"><SideBar /></div>
          
          {/* Main content area */}
          <main className="ml-0 md:ml-[400px] min-h-screen">
            {children}
          </main>
      </body>
    </html>
  );
}
