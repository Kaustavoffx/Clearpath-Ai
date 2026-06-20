import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { User, GraduationCap, FileText, Settings as SettingsIcon, ShieldAlert, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsForm } from "@/components/settings/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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
               <div className="max-w-2xl bg-glass-surface p-6 rounded-[24px] border border-glass-border">
                 <SettingsForm initialProfile={profile} userEmail={user.email} />
               </div>
            </TabsContent>

            <TabsContent value="education" className="outline-none animate-in fade-in duration-500 m-0">
               <div className="max-w-2xl bg-glass-surface p-6 rounded-[24px] border border-glass-border flex flex-col items-center justify-center text-center h-[300px]">
                 <GraduationCap className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
                 <h2 className="text-[16px] font-semibold text-foreground mb-2">Education Profile</h2>
                 <p className="text-[14px] text-muted-foreground max-w-[400px]">Connect your university or school records to automatically verify eligibility across all opportunities.</p>
               </div>
            </TabsContent>

            <TabsContent value="documents" className="outline-none animate-in fade-in duration-500 m-0">
               <div className="max-w-2xl bg-glass-surface p-6 rounded-[24px] border border-glass-border flex flex-col items-center justify-center text-center h-[300px]">
                 <FileText className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
                 <h2 className="text-[16px] font-semibold text-foreground mb-2">Identity Documents</h2>
                 <p className="text-[14px] text-muted-foreground max-w-[400px]">Securely store reusable identity documents like Aadhar, Passports, and Transcripts for instant opportunity generation.</p>
               </div>
            </TabsContent>

            <TabsContent value="preferences" className="outline-none animate-in fade-in duration-500 m-0">
               <div className="max-w-2xl bg-glass-surface p-6 rounded-[24px] border border-glass-border flex flex-col items-center justify-center text-center h-[300px]">
                 <SettingsIcon className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
                 <h2 className="text-[16px] font-semibold text-foreground mb-2">System Preferences</h2>
                 <p className="text-[14px] text-muted-foreground max-w-[400px]">Configure default UI scales, accessibility settings, and notification frequency.</p>
               </div>
            </TabsContent>

            <TabsContent value="security" className="outline-none animate-in fade-in duration-500 m-0">
               <div className="max-w-2xl bg-glass-surface p-6 rounded-[24px] border border-glass-border flex flex-col items-center justify-center text-center h-[300px]">
                 <ShieldAlert className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
                 <h2 className="text-[16px] font-semibold text-foreground mb-2">Security & Sessions</h2>
                 <p className="text-[14px] text-muted-foreground max-w-[400px]">Manage active sessions, update your password, and enable multi-factor authentication.</p>
               </div>
            </TabsContent>

            <TabsContent value="usage" className="outline-none animate-in fade-in duration-500 m-0">
               <div className="max-w-2xl bg-glass-surface p-6 rounded-[24px] border border-glass-border flex flex-col items-center justify-center text-center h-[300px]">
                 <Activity className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
                 <h2 className="text-[16px] font-semibold text-foreground mb-2">Usage Metrics</h2>
                 <p className="text-[14px] text-muted-foreground max-w-[400px]">Detailed breakdown of your compute usage, storage allocation, and subscription plan limits.</p>
               </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

    </div>
  )
}
