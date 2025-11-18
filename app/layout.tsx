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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={`${geistSans.variable} ${geistMono.variable} ${interSans.variable} antialiased`}>
       <div className="flex">
          {/* Sidebar */}
          <SideBar />
          
          {/* Main content area */}
          <main className="ml-[400px] flex-1 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
