import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | ClearPath AI",
    default: "ClearPath AI | Educational Opportunities Decoded",
  },
  description: "Transform confusing educational opportunities into personalized action plans using advanced AI. Never miss a scholarship, internship, or competition deadline again.",
  keywords: ["education", "scholarship", "AI", "high school", "action plan", "opportunities", "student"],
  authors: [{ name: "ClearPath Team" }],
  creator: "ClearPath AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://clearpath-ai.example.com",
    title: "ClearPath AI | Educational Opportunities Decoded",
    description: "Transform confusing educational opportunities into personalized action plans using advanced AI.",
    siteName: "ClearPath AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearPath AI",
    description: "Transform confusing educational opportunities into personalized action plans using advanced AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-apple-base text-foreground tracking-[-0.015em]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
