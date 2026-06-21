import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Settings as SettingsIcon, ShieldAlert, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { PreferencesPanel } from "@/components/settings/preferences-panel"
import { SecurityCenter } from "@/components/settings/security-center"
import { UsageAnalytics } from "@/components/settings/usage-analytics"

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch only settings related profile data
  const [
    { data: preferences },
    { data: security },
    { data: usage },
    { data: sessions },
    { count: openaiCalls },
    { count: geminiCalls }
  ] = await Promise.all([
    supabase.from('user_preferences').select('*').eq('user_id', user.id).single(),
    supabase.from('user_security_settings').select('*').eq('user_id', user.id).single(),
    supabase.from('user_usage_metrics').select('*').eq('user_id', user.id).single(),
    supabase.from('user_sessions').select('*').eq('user_id', user.id).order('last_active', { ascending: false }),
    supabase.from('usage_logs').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('service', 'OpenAI'),
    supabase.from('usage_logs').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('service', 'Gemini')
  ])

  // Merge live usage counts with standard usage metrics
  const liveUsage = {
    ...(usage || {}),
    openai_calls: openaiCalls || 0,
    gemini_calls: geminiCalls || 0
  }

  return (
    <div className="container-wide min-h-[calc(100vh-5rem)] flex flex-col pt-6 pb-12 gap-6 animate-fadeInUp max-w-[1440px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-glass-border pb-6">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight mb-2 text-foreground flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary" /> System Settings
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-[600px]">
            Manage your ClearPath OS preferences, AI configuration, security, and usage limits.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs defaultValue="preferences" className="w-full flex-1 flex flex-col">
          <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden border-b border-glass-border rounded-none bg-transparent h-auto p-0 gap-8 hide-scrollbar shrink-0">
            <TabsTrigger value="preferences" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[13px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><SettingsIcon className="w-4 h-4" /> Preferences</TabsTrigger>
            <TabsTrigger value="security" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[13px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><ShieldAlert className="w-4 h-4" /> Security</TabsTrigger>
            <TabsTrigger value="usage" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[13px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><Activity className="w-4 h-4" /> Usage</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto scrollbar-none pt-6">
            <TabsContent value="preferences" className="outline-none animate-in fade-in duration-500 m-0">
               <PreferencesPanel initialPreferences={preferences} />
            </TabsContent>

            <TabsContent value="security" className="outline-none animate-in fade-in duration-500 m-0">
               <SecurityCenter initialSecurity={security} initialSessions={sessions || []} />
            </TabsContent>

            <TabsContent value="usage" className="outline-none animate-in fade-in duration-500 m-0">
               <UsageAnalytics initialUsage={liveUsage} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

    </div>
  )
}
