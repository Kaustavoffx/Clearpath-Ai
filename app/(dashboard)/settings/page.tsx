import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { revalidatePath } from "next/cache"
import { UserCircle, Settings2, Sparkles } from "lucide-react"
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
    <div className="flex flex-col gap-8 max-w-[800px] mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-apple-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
          <Settings2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Preferences</h1>
          <p className="text-muted-foreground text-section text-sm mt-1">
            Manage your personal data and application settings.
          </p>
        </div>
      </div>

      <div className="glass-thick rounded-apple-xl border border-apple-glass-border shadow-apple-md relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <form action={updateProfile}>
          <div className="p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-apple-glass-border pb-8 mb-8">
              <div className="h-20 w-20 shrink-0 rounded-full bg-background/50 border border-apple-glass-highlight flex items-center justify-center shadow-inner relative group cursor-pointer">
                <UserCircle className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Personal Identity</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-md leading-relaxed">
                  We use this information to personalize your AI extraction and automatically determine if you fit certain criteria.
                </p>
              </div>
            </div>

            <div className="space-y-8 max-w-lg">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-sm font-medium text-foreground ml-1">Email Account</Label>
                <Input 
                  id="email" 
                  value={user.email} 
                  disabled 
                  className="h-12 bg-muted/30 border-apple-glass-border rounded-apple-md px-4 opacity-70 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground ml-1">Your core identity. Cannot be changed directly.</p>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="full_name" className="text-sm font-medium text-foreground ml-1">Legal Name</Label>
                <Input 
                  id="full_name" 
                  name="full_name" 
                  defaultValue={profile?.full_name || ''} 
                  className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="grade_level" className="text-sm font-medium text-foreground ml-1">Academic Status</Label>
                <Input 
                  id="grade_level" 
                  name="grade_level" 
                  defaultValue={profile?.grade_level || ''} 
                  placeholder="e.g. High School Senior, 12th Grade" 
                  className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-muted/10 border-t border-apple-glass-border px-8 sm:px-10 py-6 flex justify-end">
            <Button type="submit" className="h-12 px-8 rounded-apple-md font-medium text-base shadow-apple-sm spring-active">
              Save Preferences
            </Button>
          </div>
        </form>
      </div>

      {/* New Local AI Context Profile Form */}
      <ProfileForm />
    </div>
  )
}
