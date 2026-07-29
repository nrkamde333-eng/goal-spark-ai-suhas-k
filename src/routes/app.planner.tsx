import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/store";
import { generatePlan, chatAssistant } from "@/lib/ai-planner.functions";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, RotateCcw, Plus, Calendar as CalendarIcon, Zap, User } from "lucide-react";
import { toast } from "sonner";
import type { GeneratedPlan } from "@/lib/demo-data";
import { addDays } from "date-fns";

export const Route = createFileRoute("/app/planner")({
  head: () => ({ meta: [{ title: "AI Planner — GoalPilot" }] }),
  component: Planner,
});

const suggestions = [
  "I want to learn Python in 3 months",
  "Prepare for Google interviews in 90 days",
  "Run my first half-marathon in 16 weeks",
  "Launch a SaaS MVP in 6 weeks",
];

function Planner() {
  const { state, addMessage, addGoal, addTask, addHabit, addEvent, setState } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const gen = useServerFn(generatePlan);
  const chat = useServerFn(chatAssistant);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [state.messages.length, loading]);

  const submit = async (goal: string) => {
    if (!goal.trim() || loading) return;
    setInput("");
    addMessage({ role: "user", content: goal });
    setLoading(true);
    try {
      const plan = (await gen({ data: { goal } })) as GeneratedPlan;
      addMessage({ role: "assistant", content: plan.summary || "Here's your plan.", plan });
    } catch (e: any) {
      toast.error(e?.message ?? "AI request failed");
      // Fallback local plan
      addMessage({
        role: "assistant",
        content: "Here's a plan draft (offline).",
        plan: {
          goalTitle: goal.slice(0, 60),
          summary: "A pragmatic plan to move steadily toward your goal with weekly milestones and daily habits.",
          difficulty: "medium",
          estimatedHours: 120,
          timeline: "12 weeks",
          milestones: [
            { title: "Foundation & research", week: 2 },
            { title: "First tangible deliverable", week: 4 },
            { title: "Midway checkpoint", week: 8 },
            { title: "Final push & polish", week: 12 },
          ],
          weeklyTasks: ["Block 5h of deep work", "Weekly review Fri", "Ship one thing", "Read 2 references"],
          dailyTasks: ["25-min deep session", "10-min review", "1 tiny action", "Reflect in journal"],
          habits: [{ name: "Deep work 1h", emoji: "🎯" }, { name: "Journal", emoji: "📝" }, { name: "Move body", emoji: "🏃" }],
          tips: ["Start absurdly small.", "Track streaks, not perfection.", "Ship > polish."],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptPlan = (plan: GeneratedPlan) => {
    const goal = addGoal({
      title: plan.goalTitle,
      description: plan.summary,
      progress: 0,
      targetDate: addDays(new Date(), Math.min(365, parseInt(plan.timeline) * 7 || 84)).toISOString(),
      category: "study",
      milestones: plan.milestones.map((m, i) => ({ id: `m${i}`, title: m.title, done: false })),
    });
    plan.dailyTasks.forEach((t, i) => {
      addTask({
        title: t,
        priority: "medium",
        status: "todo",
        dueDate: addDays(new Date(), i).toISOString(),
        category: "study",
        goalId: goal.id,
        startTime: `${9 + (i % 4)}:00`,
        endTime: `${10 + (i % 4)}:00`,
      });
      const day = addDays(new Date(), i).toISOString().slice(0, 10);
      addEvent({
        title: t,
        start: `${day}T${String(9 + (i % 4)).padStart(2, "0")}:00:00`,
        end: `${day}T${String(10 + (i % 4)).padStart(2, "0")}:00:00`,
        category: "study",
        goalId: goal.id,
      });
    });
    plan.habits.forEach((h) =>
      addHabit({ name: h.name, emoji: h.emoji, frequency: "daily", color: "brand" }),
    );
    toast.success(`Plan applied to your workspace — ${plan.dailyTasks.length} tasks & ${plan.habits.length} habits added`);
  };

  const askAssistant = async (q: string) => {
    if (loading) return;
    addMessage({ role: "user", content: q });
    setLoading(true);
    try {
      const res = await chat({ data: { messages: [...state.messages.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: q }] } });
      addMessage({ role: "assistant", content: res.content });
    } catch (e: any) {
      toast.error(e?.message ?? "AI request failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight flex items-center gap-2">
            <Sparkles className="size-6 text-primary" /> AI Planner
          </h1>
          <p className="text-sm text-muted-foreground">Describe any goal. Get a personalized roadmap.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setState((s) => ({ ...s, messages: [] }))}>
          <RotateCcw className="size-4 mr-1" /> New chat
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {state.messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6">
              <div className="size-16 rounded-2xl gradient-brand grid place-items-center shadow-xl shadow-primary/30">
                <Sparkles className="size-8 text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl">What do you want to achieve?</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">Type any goal — big, small, wild. I'll build the whole plan.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 max-w-2xl w-full">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => submit(s)} className="text-left p-3 rounded-xl border hover:border-primary/40 hover:bg-muted/30 transition text-sm">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {state.messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="size-8 rounded-lg gradient-brand grid place-items-center shrink-0">
                  <Sparkles className="size-4 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] ${m.role === "user" ? "order-2" : ""}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/40 border rounded-tl-sm"
                }`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
                {m.plan && <PlanCard plan={m.plan} onAccept={() => acceptPlan(m.plan!)} onRegenerate={() => submit(m.plan!.goalTitle)} />}
              </div>
              {m.role === "user" && (
                <div className="size-8 rounded-lg bg-muted grid place-items-center shrink-0 order-3">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="size-8 rounded-lg gradient-brand grid place-items-center shrink-0">
                <Sparkles className="size-4 text-white animate-pulse" />
              </div>
              <div className="bg-muted/40 border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-muted-foreground">
                Thinking through your plan…
              </div>
            </div>
          )}
        </div>
        <div className="border-t p-3 md:p-4">
          <div className="flex gap-2 mb-2 flex-wrap">
            {["What should I do next?", "Plan my weekend", "Make tomorrow easier"].map((s) => (
              <button key={s} onClick={() => askAssistant(s)} className="text-xs px-3 py-1 rounded-full border hover:bg-muted/50 transition">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); submit(input); }} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
              placeholder="I want to…"
              rows={2}
              className="resize-none rounded-2xl"
            />
            <Button type="submit" disabled={loading || !input.trim()} className="rounded-2xl gradient-brand text-white self-end">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

function PlanCard({ plan, onAccept, onRegenerate }: { plan: GeneratedPlan; onAccept: () => void; onRegenerate: () => void }) {
  return (
    <Card className="mt-3 border-primary/30 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base">{plan.goalTitle}</CardTitle>
            <div className="mt-2 flex gap-1.5 flex-wrap">
              <Badge variant="outline" className="uppercase text-[10px] border-primary/30 text-primary">{plan.difficulty}</Badge>
              <Badge variant="outline" className="uppercase text-[10px]">{plan.timeline}</Badge>
              <Badge variant="outline" className="uppercase text-[10px]"><Zap className="size-3 mr-0.5" /> {plan.estimatedHours}h</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Milestones</div>
          <div className="space-y-1.5">
            {plan.milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <div className="size-6 rounded-full gradient-brand grid place-items-center text-[10px] font-bold text-white">{m.week}w</div>
                <span>{m.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Weekly tasks</div>
            <ul className="space-y-1 text-xs">
              {plan.weeklyTasks.slice(0, 5).map((t, i) => <li key={i} className="flex gap-2"><span className="text-primary">•</span>{t}</li>)}
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Recommended habits</div>
            <div className="flex flex-wrap gap-1.5">
              {plan.habits.map((h, i) => (
                <span key={i} className="px-2 py-1 rounded-full bg-muted/50 border text-xs">{h.emoji} {h.name}</span>
              ))}
            </div>
          </div>
        </div>
        {plan.tips?.length ? (
          <div className="p-3 rounded-lg gradient-brand text-white text-xs space-y-1">
            {plan.tips.slice(0, 3).map((t, i) => <div key={i}>💡 {t}</div>)}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" onClick={onAccept} className="rounded-full gradient-brand text-white">
            <Plus className="size-4 mr-1" /> Accept plan
          </Button>
          <Button size="sm" variant="outline" onClick={onRegenerate} className="rounded-full">
            <RotateCcw className="size-4 mr-1" /> Regenerate
          </Button>
          <Button size="sm" variant="outline" onClick={onAccept} className="rounded-full">
            <CalendarIcon className="size-4 mr-1" /> Add to calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
