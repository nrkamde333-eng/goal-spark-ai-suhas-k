import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Calendar, Target, LineChart, Zap, CheckCircle2, Brain, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GoalPilot — Plan Smarter. Achieve Faster." },
      { name: "description", content: "AI productivity coach that turns your goals into daily action plans, calendar events, tasks and habits." },
      { property: "og:title", content: "GoalPilot — Plan Smarter. Achieve Faster." },
      { property: "og:description", content: "AI productivity coach that turns your goals into daily action plans." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg gradient-brand grid place-items-center shadow-lg shadow-primary/30">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight">GoalPilot</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="text-sm font-medium hover:text-foreground text-muted-foreground px-3 py-2">Sign in</Link>
            <Link to="/app">
              <Button className="rounded-full gradient-brand text-white shadow-lg shadow-primary/30 hover:opacity-90">
                Try Demo <ArrowRight className="size-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative rounded-full size-2 bg-primary" />
            </span>
            Powered by Lovable AI
          </div>
          <h1 className="mt-6 font-display font-extrabold text-5xl md:text-7xl tracking-tight text-balance">
            Plan Smarter. <br className="hidden md:block" />
            Achieve <span className="text-gradient">Faster</span>.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            Your AI productivity coach that turns ambitious goals into daily action plans, calendar events, tasks and habits — all in one focused workspace.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/app">
              <Button size="lg" className="rounded-full gradient-brand text-white shadow-xl shadow-primary/30 hover:opacity-90">
                Try Demo <ArrowRight className="size-4 ml-1" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="rounded-full">
                Create free account
              </Button>
            </Link>
          </div>

          {/* Dashboard mockup */}
          <div className="relative mt-16 mx-auto max-w-5xl">
            <div className="absolute -inset-4 gradient-brand opacity-20 blur-3xl rounded-3xl" />
            <div className="relative glass rounded-2xl border shadow-2xl overflow-hidden text-left">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-card/40">
                <span className="size-2.5 rounded-full bg-red-500/70" />
                <span className="size-2.5 rounded-full bg-yellow-500/70" />
                <span className="size-2.5 rounded-full bg-green-500/70" />
                <span className="ml-4 text-xs text-muted-foreground font-mono">goalpilot.ai/app</span>
              </div>
              <div className="grid grid-cols-12 min-h-[440px]">
                <div className="col-span-3 border-r p-4 bg-sidebar/60 hidden md:block">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Workspace</div>
                  {["Dashboard", "AI Planner", "Calendar", "Tasks", "Habits", "Analytics"].map((n, i) => (
                    <div key={n} className={`px-3 py-2 rounded-lg text-sm mb-1 ${i === 1 ? "bg-primary/15 text-foreground font-medium" : "text-muted-foreground"}`}>{n}</div>
                  ))}
                </div>
                <div className="col-span-12 md:col-span-9 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Brain className="size-4 text-primary" /> GoalPilot AI
                  </div>
                  <div className="glass rounded-xl p-4 border">
                    <div className="text-sm text-muted-foreground italic">"I want to learn Python in 3 months."</div>
                  </div>
                  <div className="glass rounded-xl p-4 border-primary/30 border">
                    <div className="text-sm font-semibold mb-2">Your personalized 12-week roadmap</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {["Weeks 1-2 · Syntax & basics", "Weeks 3-4 · Data structures", "Weeks 5-8 · Flask API project", "Weeks 9-12 · Portfolio + interview prep"].map((m) => (
                        <div key={m} className="p-2 rounded-lg bg-muted/40 border flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-primary" /> {m}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="rounded-lg gradient-brand text-white">Add to calendar</Button>
                      <Button size="sm" variant="outline" className="rounded-lg">Regenerate</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold text-primary uppercase tracking-widest">Features</div>
          <h2 className="mt-3 font-display font-bold text-4xl tracking-tight">Everything you need to actually finish</h2>
          <p className="mt-4 text-muted-foreground">One workspace that replaces five apps — powered by an AI that knows your goals.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: "AI Goal Planner", desc: "Describe any goal — get milestones, weekly plans and daily tasks in seconds." },
            { icon: Calendar, title: "Smart Calendar", desc: "Auto-schedule work into your week. Drag, drop, reschedule. Never miss deadlines." },
            { icon: CheckCircle2, title: "Task Manager", desc: "Priorities, subtasks, recurring, tags. Built for high-signal focus." },
            { icon: Target, title: "Habit Tracker", desc: "Streaks, heatmaps and daily nudges to build consistency." },
            { icon: Zap, title: "Smart Reminders", desc: "Just-in-time notifications so nothing falls through the cracks." },
            { icon: LineChart, title: "Progress Analytics", desc: "Focus hours, completion rate, streaks and productivity score." },
          ].map((f) => (
            <div key={f.title} className="group glass rounded-2xl border p-6 hover:border-primary/40 transition">
              <div className="size-10 rounded-xl gradient-brand grid place-items-center shadow-lg shadow-primary/20 mb-4">
                <f.icon className="size-5 text-white" />
              </div>
              <div className="font-display font-bold text-lg">{f.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-24 border-t">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold text-primary uppercase tracking-widest">How it works</div>
          <h2 className="mt-3 font-display font-bold text-4xl tracking-tight">From goal to daily action in 5 steps</h2>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { n: "01", t: "Sign in", d: "Create your account in seconds." },
            { n: "02", t: "Tell AI your goal", d: "One sentence is enough." },
            { n: "03", t: "Get a roadmap", d: "AI generates the whole plan." },
            { n: "04", t: "Do the work", d: "Daily tasks, calendar, habits." },
            { n: "05", t: "Track progress", d: "Beautiful analytics keep you honest." },
          ].map((s) => (
            <div key={s.n} className="glass rounded-2xl border p-5">
              <div className="text-xs font-mono text-primary">{s.n}</div>
              <div className="mt-2 font-display font-bold">{s.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t">
        <div className="text-center mb-16">
          <div className="text-xs font-bold text-primary uppercase tracking-widest">Loved by doers</div>
          <h2 className="mt-3 font-display font-bold text-4xl tracking-tight">Built for the ambitious</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Priya S.", role: "Founder, Indie SaaS", quote: "I shipped my MVP in 6 weeks. The AI turned my scattered ideas into a real weekly plan." },
            { name: "Marcus L.", role: "Engineering Lead", quote: "It's Notion + Calendar + a coach that actually pushes me. My focus hours doubled." },
            { name: "Ana R.", role: "Med student", quote: "The habit heatmap alone changed how I study. 62 day streak and counting." },
          ].map((t) => (
            <div key={t.name} className="glass rounded-2xl border p-6">
              <div className="text-sm leading-relaxed">"{t.quote}"</div>
              <div className="mt-4 flex items-center gap-3">
                <div className="size-10 rounded-full gradient-brand grid place-items-center font-bold text-white text-sm">
                  {t.name.split(" ").map((x) => x[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-24 border-t">
        <div className="text-center mb-16">
          <div className="text-xs font-bold text-primary uppercase tracking-widest">Pricing</div>
          <h2 className="mt-3 font-display font-bold text-4xl tracking-tight">Start free. Upgrade when you're ready.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl border p-8">
            <div className="text-sm font-semibold text-muted-foreground">Free</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-display font-extrabold">$0</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              {["AI Goal Planner", "Unlimited tasks & habits", "Smart calendar", "Analytics dashboard"].map((f) => (
                <li key={f} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> {f}</li>
              ))}
            </ul>
            <Link to="/app" className="block mt-8">
              <Button className="w-full rounded-full" variant="outline">Get started</Button>
            </Link>
          </div>
          <div className="rounded-2xl border-primary/40 border p-8 relative overflow-hidden gradient-brand text-white">
            <div className="absolute -top-16 -right-16 size-48 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="text-sm font-semibold opacity-80">Premium · Coming soon</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-display font-extrabold">$12</span>
                <span className="opacity-80">/mo</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {["Advanced AI models", "Google Calendar sync", "Team workspaces", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="size-4" /> {f}</li>
                ))}
              </ul>
              <Button className="w-full mt-8 rounded-full bg-white text-primary hover:bg-white/90">Join waitlist</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24 border-t">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-primary uppercase tracking-widest">FAQ</div>
          <h2 className="mt-3 font-display font-bold text-4xl tracking-tight">Questions, answered</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: "How does the AI planner work?", a: "Describe your goal in one sentence. Our AI breaks it down into milestones, weekly and daily tasks, recommended habits, and a calendar schedule." },
            { q: "Is my data private?", a: "Yes — everything stays on your device in this demo. Sign in to sync across devices." },
            { q: "Can I sync my Google Calendar?", a: "Google Calendar sync is on our roadmap for Premium." },
            { q: "What if the AI plan doesn't fit me?", a: "Every plan is editable. Regenerate, modify tasks, drag events, delete steps — you're always in control." },
          ].map((item, i) => (
            <AccordionItem key={i} value={`i-${i}`}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="relative rounded-3xl border p-10 md:p-16 text-center overflow-hidden gradient-brand text-white">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative">
            <Clock className="size-8 mx-auto mb-4" />
            <h2 className="font-display font-extrabold text-3xl md:text-5xl">Your future self is waiting.</h2>
            <p className="mt-4 opacity-90 max-w-xl mx-auto">Stop planning. Start doing. Let AI handle the roadmap.</p>
            <Link to="/app">
              <Button size="lg" className="mt-8 rounded-full bg-white text-primary hover:bg-white/90">
                Try demo — no signup <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md gradient-brand grid place-items-center">
              <Sparkles className="size-3 text-white" />
            </div>
            <span className="font-display font-bold text-foreground">GoalPilot</span>
            <span>· © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">About</a>
            <a href="#" className="hover:text-foreground">Contact</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
