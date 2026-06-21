import type { Metadata } from "next";
import { cmGeom } from "@/lib/fonts";
import "./globals.css";
import { Suspense } from 'react'
import { ClearPathAmbientBackground } from '@/components/layout/clearpath-ambient-background'
import { ThemeProvider } from "@/components/theme-provider"
import { ResponsiveQA } from "@/components/qa/responsive-check"
import { createClient } from "@/lib/supabase/server"

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let prefs = null;
  if (user) {
    const { data } = await supabase.from('user_preferences').select('*').eq('user_id', user.id).single()
    prefs = data;
  }

  // Determine system appearance/theme
  let theme = 'dark' // default
  if (prefs?.appearance === 'Light') theme = 'light'
  else if (prefs?.appearance === 'Neutral') theme = 'neutral'
  
  const motionClass = prefs?.reduce_motion ? 'reduce-motion' : '';
  const densityClass = prefs?.workspace_mode === 'Compact Mode' ? 'density-compact' : 'density-detailed';

  return (
    <html lang="en" suppressHydrationWarning className={`${theme} ${motionClass} ${densityClass}`}>
      <head>
        {/* Ambient background manages its own rendering without heavy image preloads */}
      </head>
      <body className={`${cmGeom.variable} font-sans antialiased text-foreground min-h-screen flex flex-col relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={['light', 'dark', 'neutral']}
          forcedTheme={theme}
          disableTransitionOnChange
        >
          <div className="relative z-10 flex-1 flex flex-col w-full h-full">
            <Suspense fallback={null}>
              {!prefs?.reduce_motion && <ClearPathAmbientBackground />}
            </Suspense>
            {children}
            <Suspense fallback={null}>
              <ResponsiveQA />
            </Suspense>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
