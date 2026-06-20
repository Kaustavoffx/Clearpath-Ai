import { createClient } from "@/lib/supabase/server"
import { Cpu, Activity, Zap, CheckCircle2, Mic, Settings, Search, Lock } from "lucide-react"

export default async function IntelligenceDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Mock fetching health metrics for now
  const models = [
    { name: "Gemini 1.5 Pro", status: "Active", latency: "12ms", route: "Core Reasoning", usage: "120 / 500" },
    { name: "OpenAI gpt-4o", status: "Fallback", latency: "85ms", route: "Complex Abstraction", usage: "45 / 100" },
    { name: "Deepgram Nova-2", status: "Active", latency: "25ms", route: "Voice & Audio", usage: "3 / 50" },
    { name: "Llama 3 70B", status: "Offline", latency: "-", route: "Local Fast-Path", usage: "0 / 0" }
  ];

  return (
    <div className="container-wide min-h-[calc(100vh-5rem)] flex flex-col pt-6 pb-12 gap-6 animate-fadeInUp max-w-[1440px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-glass-border pb-6">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight mb-2 text-foreground flex items-center gap-2">
            <Cpu className="w-6 h-6 text-primary" /> Intelligence Core
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-[600px]">
            System diagnostics and provider routing for the OS reasoning engine.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-semibold text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> All Systems Operational
        </div>
      </div>

      {/* CORE METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="liquid-glass-card p-5 rounded-[20px] flex flex-col">
          <Activity className="w-4 h-4 text-primary mb-2" />
          <div className="text-[28px] font-semibold tracking-tight text-foreground">12ms</div>
          <div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mt-1">Avg Latency</div>
        </div>
        <div className="liquid-glass-card p-5 rounded-[20px] flex flex-col">
          <CheckCircle2 className="w-4 h-4 text-success mb-2" />
          <div className="text-[28px] font-semibold tracking-tight text-success">99.9%</div>
          <div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mt-1">API Health</div>
        </div>
        <div className="liquid-glass-card p-5 rounded-[20px] flex flex-col">
          <Zap className="w-4 h-4 text-warning mb-2" />
          <div className="text-[28px] font-semibold tracking-tight text-foreground">165</div>
          <div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mt-1">Analyses Run</div>
        </div>
        <div className="liquid-glass-card p-5 rounded-[20px] flex flex-col">
          <Mic className="w-4 h-4 text-primary mb-2" />
          <div className="text-[28px] font-semibold tracking-tight text-foreground">Active</div>
          <div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mt-1">Voice Subsystem</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* MODEL ROUTING TABLE */}
        <div className="lg:col-span-2 liquid-glass-card rounded-[24px] p-6 border border-glass-border flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-semibold text-foreground flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" /> Active Providers
            </h2>
            <button className="text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              <Settings className="w-3 h-3" /> Manage Keys
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-border bg-black/20">
                  <th className="py-2 px-4 text-[11px] uppercase font-semibold text-muted-foreground tracking-widest">Model</th>
                  <th className="py-2 px-4 text-[11px] uppercase font-semibold text-muted-foreground tracking-widest">Status</th>
                  <th className="py-2 px-4 text-[11px] uppercase font-semibold text-muted-foreground tracking-widest">Latency</th>
                  <th className="py-2 px-4 text-[11px] uppercase font-semibold text-muted-foreground tracking-widest">Route</th>
                  <th className="py-2 px-4 text-[11px] uppercase font-semibold text-muted-foreground tracking-widest">Usage</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model, i) => (
                  <tr key={i} className="border-b border-glass-border/50 hover:bg-glass-layer transition-colors">
                    <td className="py-3 px-4 text-[14px] font-medium text-foreground whitespace-nowrap">{model.name}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        model.status === 'Active' ? 'bg-success/10 text-success' :
                        model.status === 'Fallback' ? 'bg-warning/10 text-warning' :
                        'bg-glass-border text-muted-foreground'
                      }`}>{model.status}</span>
                    </td>
                    <td className="py-3 px-4 text-[13px] text-foreground">{model.latency}</td>
                    <td className="py-3 px-4 text-[13px] text-muted-foreground">{model.route}</td>
                    <td className="py-3 px-4 text-[13px] font-medium">{model.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECURITY & QUOTAS */}
        <div className="flex flex-col gap-6">
          <div className="liquid-glass-card rounded-[24px] p-6 border border-glass-border">
            <h2 className="text-[14px] font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-warning" /> Security Enclave
            </h2>
            <p className="text-[13px] text-muted-foreground mb-4">
              All API keys are encrypted at rest using AES-256-GCM and never logged in our systems.
            </p>
            <div className="h-10 bg-black/40 rounded-[10px] border border-glass-border flex items-center justify-between px-3">
              <span className="text-[12px] font-mono text-muted-foreground tracking-widest">sk-proj-••••••••••••</span>
              <span className="text-[10px] font-bold text-success uppercase tracking-widest">Encrypted</span>
            </div>
          </div>

          <div className="liquid-glass-card rounded-[24px] p-6 border border-glass-border flex-1">
            <h2 className="text-[14px] font-semibold text-foreground mb-4">Resource Quotas</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-muted-foreground">Free Analyses</span>
                  <span className="font-semibold text-foreground">3 / 10 Used</span>
                </div>
                <div className="h-1.5 w-full bg-glass-surface rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[30%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-muted-foreground">Voice Minutes</span>
                  <span className="font-semibold text-foreground">14 / 60 Used</span>
                </div>
                <div className="h-1.5 w-full bg-glass-surface rounded-full overflow-hidden">
                  <div className="h-full bg-warning w-[25%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-muted-foreground">Local Storage</span>
                  <span className="font-semibold text-foreground">1.2 GB / 5 GB</span>
                </div>
                <div className="h-1.5 w-full bg-glass-surface rounded-full overflow-hidden">
                  <div className="h-full bg-danger w-[24%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
