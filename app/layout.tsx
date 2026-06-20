import type { Metadata } from "next";
import { cmGeom } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

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
      <head>
        {/* Ambient background manages its own rendering without heavy image preloads */}
      </head>
      <body className={`${cmGeom.variable} font-sans antialiased text-foreground min-h-screen flex flex-col relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={['light', 'dark', 'neutral']}
          disableTransitionOnChange
        >
          <div className="relative z-10 flex-1 flex flex-col w-full h-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
