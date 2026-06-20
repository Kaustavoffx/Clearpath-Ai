import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { User, GraduationCap, FileText, Settings as SettingsIcon, ShieldAlert, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { IdentityForm } from "@/components/settings/identity-form"
import { EducationDashboard } from "@/components/settings/education-dashboard"
import { DocumentVault } from "@/components/settings/document-vault"
import { PreferencesPanel } from "@/components/settings/preferences-panel"
import { SecurityCenter } from "@/components/settings/security-center"
import { UsageAnalytics } from "@/components/settings/usage-analytics"

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch all related profile data concurrently
  const [
    { data: profile },
    { data: education },
    { data: documents },
    { data: preferences },
    { data: security },
    { data: usage }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('education_profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('document_vault').select('*').eq('user_id', user.id),
    supabase.from('user_preferences').select('*').eq('user_id', user.id).single(),
    supabase.from('user_security_settings').select('*').eq('user_id', user.id).single(),
    supabase.from('user_usage_metrics').select('*').eq('user_id', user.id).single()
  ])

  return (
    <div className="container-wide min-h-[calc(100vh-5rem)] flex flex-col pt-6 pb-12 gap-6 animate-fadeInUp max-w-[1440px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-glass-border pb-6">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight mb-2 text-foreground flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary" /> Global Settings
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-[600px]">
            Manage your personal identity, educational profile, and OS preferences.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs defaultValue="identity" className="w-full flex-1 flex flex-col">
          <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden border-b border-glass-border rounded-none bg-transparent h-auto p-0 gap-8 hide-scrollbar shrink-0">
            <TabsTrigger value="identity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[13px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><User className="w-4 h-4" /> Identity</TabsTrigger>
            <TabsTrigger value="education" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[13px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><GraduationCap className="w-4 h-4" /> Education</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[13px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><FileText className="w-4 h-4" /> Documents</TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[13px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><SettingsIcon className="w-4 h-4" /> Preferences</TabsTrigger>
            <TabsTrigger value="security" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[13px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><ShieldAlert className="w-4 h-4" /> Security</TabsTrigger>
            <TabsTrigger value="usage" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[13px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><Activity className="w-4 h-4" /> Usage</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto scrollbar-none pt-6">
            <TabsContent value="identity" className="outline-none animate-in fade-in duration-500 m-0">
               <IdentityForm initialProfile={profile} />
            </TabsContent>

            <TabsContent value="education" className="outline-none animate-in fade-in duration-500 m-0">
               <EducationDashboard initialProfile={education} />
            </TabsContent>

            <TabsContent value="documents" className="outline-none animate-in fade-in duration-500 m-0">
               <DocumentVault initialDocuments={documents || []} />
            </TabsContent>

            <TabsContent value="preferences" className="outline-none animate-in fade-in duration-500 m-0">
               <PreferencesPanel initialPreferences={preferences} />
            </TabsContent>

            <TabsContent value="security" className="outline-none animate-in fade-in duration-500 m-0">
               <SecurityCenter initialSecurity={security} />
            </TabsContent>

            <TabsContent value="usage" className="outline-none animate-in fade-in duration-500 m-0">
               <UsageAnalytics initialUsage={usage} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

    </div>
  )
}
