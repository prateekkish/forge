'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingWorkoutIndicator } from "@/components/workout/FloatingWorkoutIndicator";
import { WorkoutProvider } from "@/contexts/WorkoutContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} font-sans antialiased bg-zinc-50 dark:bg-black text-black dark:text-zinc-50`}
      >
        <WorkoutProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-20 sm:pb-24">
              {children}
            </main>
            <BottomNav />
            <FloatingWorkoutIndicator />
          </div>
        </WorkoutProvider>
      </body>
    </html>
  );
}
