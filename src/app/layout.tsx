import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workout Planner & Progress Tracker",
  description: "An advanced, fully customizable workout planner and progress tracker for strength training and bodybuilding.",
  icons: {
    icon: "/apple-touch-icon.png",
    shortcut: "/apple-touch-icon.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Iron Path",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0c0c10] text-[#e0e0e0]">
        {children}
      </body>
    </html>
  );
}
