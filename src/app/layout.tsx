import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RosterPro",
  description: "Business Solution",
  icons: '/icon.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-[#121212] text-white"}>
          <Suspense fallback='Loading'>
            <Navbar/>
            {children}
            <Toaster/>
          </Suspense>
      </body>
    </html>
  );
}
