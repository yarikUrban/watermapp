import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";

import { AuthProvider } from "@/providers/AuthProvider";
import { getUser } from "./actions/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Watermap",
  description: "watermap",
};

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getUser();
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body>
        <AuthProvider key={user?.id ?? "anonymous"} initialUser={user}>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
