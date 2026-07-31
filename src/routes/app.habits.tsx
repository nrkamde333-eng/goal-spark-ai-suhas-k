import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Flame, Plus, Trash2, Trophy } from "lucide-react";
import { addDays, format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/app/habits")({
  head: () => ({
    meta: [
      { title: "Habits — GoalPilot" },
      { name: "description", content: "Track daily habits, build streaks and see your consistency over time." },
      { property: "og:title", content: "Habits — GoalPilot" },
      { property: "og:description", content: "Build consistency with streaks and a 12-week habit heatmap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HabitsPage,
});

function HabitsPage() {
  const { state, logHabit, addHabit, deleteHabit } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", emoji: "🎯" });

  const todayKey = new Date().toISOString().slice(0, 10);
  const days = Array.from({ length: 84 }, (_, i) => format(addDays(new Date(), -83 + i), "yyyy-MM-dd"));

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight">Habits</h1>
          <p className="text-sm text-muted-foreground">Small consistent actions. Big results.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full gradient-brand text-white"><Plus className="size-4 mr-1" /> New habit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New habit</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label className="text-xs">Emoji</Label><Input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} /></div>
              <div><Label className="text-xs">Name</Label><Input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Read 30 min" /></div>
              <Button className="w-full rounded-full gradient-brand text-white" onClick={() => {
                if (!form.name.trim()) return;
                addHabit({ name: form.name.trim(), emoji: form.emoji || "✅", frequency: "daily", color: "brand" });
                toast.success("Habit created");
                setForm({ name: "", emoji: "🎯" }); setOpen(false);
              }}>Create habit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {state.habits.map((h) => {
          const done = h.log.includes(todayKey);
          return (
            <Card key={h.id} className="border overflow-hidden group">
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl grid place-items-center text-2xl bg-muted/40 border">{h.emoji}</div>
                  <div>
                    <CardTitle className="text-base">{h.name}</CardTitle>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1"><Flame className="size-3 text-warning" /> {h.streak}d</span>
                      <span className="flex items-center gap-1"><Trophy className="size-3" /> best {h.bestStreak}d</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => logHabit(h.id, todayKey)}
                    variant={done ? "secondary" : "default"}
                    size="sm"
                    className={`rounded-full ${done ? "" : "gradient-brand text-white"}`}
                  >
                    {done ? "Done ✓" : "Mark done"}
                  </Button>
                  <button onClick={() => { deleteHabit(h.id); toast.success("Habit removed"); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-[repeat(14,1fr)] md:grid-cols-[repeat(21,1fr)] lg:grid-cols-[repeat(28,1fr)] gap-1">
                  {days.map((d) => {
                    const hit = h.log.includes(d);
                    return (
                      <div
                        key={d}
                        title={d}
                        className={`aspect-square rounded-[3px] ${hit ? "gradient-brand" : "bg-muted/40"}`}
                      />
                    );
                  })}
                </div>
                <div className="mt-3 text-xs text-muted-foreground flex justify-between">
                  <span>Last 12 weeks</span>
                  <span>{Math.round((h.log.length / 84) * 100)}% consistency</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
