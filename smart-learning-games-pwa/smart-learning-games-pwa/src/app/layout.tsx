import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { LayoutClient } from "@/components/LayoutClient";

export const metadata: Metadata = {
  title: "Smart Learning Games - Educational Gaming Platform",
  description: "A fun and interactive educational gaming platform for students from Class 1 to Class 7. Learn Math, English, Science, and more through engaging games.",
  keywords: "education, learning, games, math, science, english, hindi, marathi, urdu, students, kids, school",
  authors: [{ name: "Smart Learning Games" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smart-learning-games.vercel.app",
    siteName: "Smart Learning Games",
    title: "Smart Learning Games - Educational Gaming Platform",
    description: "A fun and interactive educational gaming platform for students from Class 1 to Class 7.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Learning Games",
    description: "A fun and interactive educational gaming platform for students from Class 1 to Class 7.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Smart Learning Games",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen antialiased">
        <LayoutClient />
        {children}
      </body>
    </html>
  );
}
