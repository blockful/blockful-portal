import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Merriweather, Reddit_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { RoleProvider } from "@/contexts/RoleContext";
import { WalletProvider } from "@/components/WalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Blockful Brand Fonts
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const redditMono = Reddit_Mono({
  variable: "--font-reddit-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GateFul - Blockful's Portal",
  description:
    "Holistic governance security with and beyond code - Blockful's internal corporate portal",
  keywords: ["Blockful", "governance", "security", "portal", "corporate"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} ${redditMono.variable} antialiased`}
      >
        <SessionProvider>
          <RoleProvider>
            <WalletProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster />
                {/* <RoleChangeIndicator /> */}
                {children}
              </ThemeProvider>
            </WalletProvider>
          </RoleProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
