import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — GoalPilot" },
      { name: "description", content: "Sign in or create your GoalPilot account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Welcome to GoalPilot ✨");
    setTimeout(() => navigate({ to: "/app" }), 400);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden gradient-brand text-white">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-white/15 grid place-items-center backdrop-blur">
            <Sparkles className="size-4" />
          </div>
          <span className="font-display font-extrabold text-lg">GoalPilot</span>
        </Link>
        <div className="relative">
          <h1 className="font-display font-extrabold text-4xl leading-tight">Plan smarter.<br />Achieve faster.</h1>
          <p className="mt-4 opacity-90 max-w-md">Your AI productivity coach that turns any goal into daily action.</p>
          <div className="mt-10 space-y-3 max-w-md">
            {["AI-generated roadmaps in seconds", "Smart calendar that adapts to your life", "Habits + analytics that keep you honest"].map((s) => (
              <div key={s} className="flex items-center gap-3 text-sm">
                <div className="size-5 rounded-full bg-white/20 grid place-items-center text-xs">✓</div>
                {s}
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs opacity-80">© {new Date().getFullYear()} GoalPilot</div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="size-8 rounded-lg gradient-brand grid place-items-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-display font-extrabold text-lg">GoalPilot</span>
          </Link>

          <h2 className="font-display font-extrabold text-3xl tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to your workspace.</p>

          <Tabs defaultValue="signin" className="mt-8">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={submit} className="mt-6 space-y-4">
                <Field label="Email"><Input type="email" placeholder="you@example.com" defaultValue="alex@goalpilot.ai" /></Field>
                <Field label="Password"><Input type="password" placeholder="••••••••" defaultValue="demo1234" /></Field>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="rounded" defaultChecked /> Remember me
                  </label>
                  <a href="#" className="text-primary hover:underline">Forgot password?</a>
                </div>
                <Button type="submit" className="w-full rounded-full gradient-brand text-white">
                  Sign in <ArrowRight className="size-4 ml-1" />
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={submit} className="mt-6 space-y-4">
                <Field label="Full name"><Input placeholder="Alex Rivera" /></Field>
                <Field label="Email"><Input type="email" placeholder="you@example.com" /></Field>
                <Field label="Password"><Input type="password" placeholder="At least 8 characters" /></Field>
                <Field label="Confirm password"><Input type="password" placeholder="Re-enter" /></Field>
                <Button type="submit" className="w-full rounded-full gradient-brand text-white">
                  Create account <ArrowRight className="size-4 ml-1" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div>
          </div>
          <Button variant="outline" className="w-full rounded-full" onClick={() => { toast.success("Welcome!"); setTimeout(() => navigate({ to: "/app" }), 300); }}>
            <svg className="size-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </Button>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our <a className="underline">Terms</a> and <a className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
    </div>
  );
}
