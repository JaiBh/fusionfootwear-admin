import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ToastProvider from "@/providers/ToastProvider";
import LoadingClientWrapper from "@/components/LoadingClientWrapper";
import DemoDataRefresher from "@/components/DemoDataRefresher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FusionFootwear Admin Dashboard",
  description:
    "Full-featured admin panel for managing FusionFootwear products, categories, inventory, and analytics. Built with Next.js, Prisma, ShadCN UI, and PostgreSQL.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider></ToastProvider>
            <LoadingClientWrapper>
              <DemoDataRefresher></DemoDataRefresher>
              {children}
            </LoadingClientWrapper>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
