import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Learning Games | Play, Learn, Grow",
  description: "A joyful, multilingual collection of learning games for Classes 1–7. Practice at your own pace, earn real progress, and keep learning offline.",
  applicationName: "Smart Learning Games",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Smart Learning Games",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f7fc",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
