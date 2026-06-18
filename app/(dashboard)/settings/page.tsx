import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { revalidatePath } from "next/cache"
import { UserCircle, Settings2, Shield } from "lucide-react"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  async function updateProfile(formData: FormData) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const updates = {
        full_name: formData.get('full_name') as string,
        grade_level: formData.get('grade_level') as string,
      }

      await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        
      revalidatePath('/settings')
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-[800px] mx-auto p-6 md:p-10 animate-fadeInUp">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 rounded-[12px] bg-[#858AE3]/10 flex items-center justify-center border border-[#858AE3]/15">
          <Settings2 className="h-5 w-5 text-[#858AE3]" />
        </div>
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Preferences</h1>
          <p className="text-muted-foreground text-[13px] mt-0.5">
            Manage your identity and personalization settings.
          </p>
        </div>
      </div>

      {/* Identity Section */}
      <div className="liquid-glass-card overflow-hidden">
        <form action={updateProfile}>
          <div className="p-7">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-glass-border pb-6 mb-6">
              <div className="h-16 w-16 shrink-0 rounded-full bg-[#071225] border border-glass-border flex items-center justify-center">
                <UserCircle className="h-9 w-9 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Personal Identity</h3>
                <p className="text-muted-foreground text-[13px] mt-0.5 max-w-md leading-relaxed">
                  Used to personalize AI extraction and determine eligibility criteria.
                </p>
              </div>
            </div>

            <div className="space-y-6 max-w-lg">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[13px] font-medium text-foreground">Email Account</Label>
                <Input 
                  id="email" 
                  value={user.email} 
                  disabled 
                  className="h-11 bg-[#071225]/60 border-glass-border rounded-xl px-4 opacity-60 cursor-not-allowed text-[14px]"
                />
                <p className="text-[11px] text-muted-foreground">Core identity. Cannot be changed directly.</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="full_name" className="text-[13px] font-medium text-foreground">Legal Name</Label>
                <Input 
                  id="full_name" 
                  name="full_name" 
                  defaultValue={profile?.full_name || ''} 
                  className="h-11 bg-[#071225]/40 border-glass-border focus-visible:ring-[#858AE3] rounded-xl px-4 text-[14px]"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="grade_level" className="text-[13px] font-medium text-foreground">Academic Status</Label>
                <Input 
                  id="grade_level" 
                  name="grade_level" 
                  defaultValue={profile?.grade_level || ''} 
                  placeholder="e.g. High School Senior, 12th Grade" 
                  className="h-11 bg-[#071225]/40 border-glass-border focus-visible:ring-[#858AE3] rounded-xl px-4 text-[14px]"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-glass-border px-7 py-5 flex justify-end bg-[#071225]/30">
            <Button type="submit" className="h-10 px-6 rounded-xl font-medium text-[14px]">
              Save Identity
            </Button>
          </div>
        </form>
      </div>

      {/* AI Evaluation Profile */}
      <ProfileForm />

      {/* Privacy Notice */}
      <div className="liquid-glass-card p-6 flex items-start gap-4">
        <Shield className="w-5 h-5 text-[#858AE3] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[14px] font-medium text-foreground mb-1">Privacy</h4>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Your profile data is used exclusively for AI-powered eligibility matching. 
            API keys are stored locally and never transmitted to ClearPath servers.
          </p>
        </div>
      </div>
    </div>
  )
}
