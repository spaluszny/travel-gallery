import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter_Tight, Inter } from "next/font/google";
import SideBar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import "./globals.css";


const inter = Inter({
  subsets:['latin'],
  variable:'--font-sans'
});

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
    icon: "/favicon.png"
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={`${geistSans.variable} ${geistMono.variable} ${interSans.variable} ${inter.variable} antialiased`}>
        <Navbar/>
          <div className="hidden md:block"><SideBar /></div>
          
          <main className="ml-0 md:ml-[400px] min-h-screen">
            {children}
          </main>
      </body>
    </html>
  );
}
