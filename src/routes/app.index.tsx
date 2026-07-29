import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Flame, TrendingUp, Target as TargetIcon, Sparkles, Clock } from "lucide-react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const quotes = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "Small steps every day. — Anonymous",
  "Discipline equals freedom. — Jocko Willink",
  "You do not rise to the level of your goals. You fall to the level of your systems. — James Clear",
];

function Dashboard() {
  const { state, toggleTask } = useApp();
  const todayTasks = state.tasks.filter((t) => isToday(parseISO(t.dueDate)));
  const done = todayTasks.filter((t) => t.status === "done").length;
  const upcoming = state.events
    .filter((e) => new Date(e.start).getTime() >= Date.now())
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 5);
  const streak = Math.max(0, ...state.habits.map((h) => h.streak));
  const productivity = Math.min(100, Math.round((done / Math.max(1, todayTasks.length)) * 60 + streak * 3));
  const quote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
            Good {greeting()}, {state.user?.name.split(" ")[0]}.
          </h1>
          <p className="mt-1.5 text-muted-foreground">Here's what today looks like.</p>
        </div>
        <div className="flex items-center gap-3">
          <Stat label="Streak" value={`${streak}d`} icon={Flame} tone="warning" />
          <Stat label="Score" value={String(productivity)} icon={TrendingUp} tone="success" />
        </div>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border overflow-hidden">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Today's tasks</CardTitle>
            <span className="text-xs text-muted-foreground">{done}/{todayTasks.length} done</span>
          </CardHeader>
          <CardContent className="space-y-1">
            {todayTasks.length === 0 && <Empty msg="Nothing scheduled today. Enjoy the calm." />}
            {todayTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition group"
              >
                {t.status === "done"
                  ? <CheckCircle2 className="size-5 text-success shrink-0" />
                  : <Circle className="size-5 text-muted-foreground shrink-0 group-hover:text-primary" />}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}>{t.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    {t.startTime && <span className="flex items-center gap-1"><Clock className="size-3" />{t.startTime}</span>}
                    <CategoryBadge cat={t.category} />
                  </div>
                </div>
                <PriorityDot p={t.priority} />
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base">Productivity</CardTitle></CardHeader>
          <CardContent>
            <div className="relative aspect-square w-40 mx-auto grid place-items-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                <circle cx="50" cy="50" r="42" strokeWidth="10" fill="none" className="stroke-muted" />
                <circle cx="50" cy="50" r="42" strokeWidth="10" fill="none" strokeLinecap="round" className="stroke-primary"
                  strokeDasharray={`${(productivity / 100) * 264} 264`} />
              </svg>
              <div className="relative text-center">
                <div className="font-display font-extrabold text-4xl">{productivity}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Today</div>
              </div>
            </div>
            <div className="grid grid-cols-3 mt-4 gap-2 text-center">
              <MiniStat label="Focus" value="3.2h" />
              <MiniStat label="Habits" value={`${state.habits.filter(h => h.log.includes(new Date().toISOString().slice(0,10))).length}/${state.habits.length}`} />
              <MiniStat label="Done" value={`${done}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base">Upcoming events</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {upcoming.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40">
                <div className="w-12 text-center shrink-0">
                  <div className="text-[10px] text-muted-foreground uppercase">{format(parseISO(e.start), "MMM")}</div>
                  <div className="font-bold text-lg leading-none">{format(parseISO(e.start), "d")}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{e.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {isToday(parseISO(e.start)) ? "Today" : isTomorrow(parseISO(e.start)) ? "Tomorrow" : format(parseISO(e.start), "EEE")} · {format(parseISO(e.start), "HH:mm")}
                  </div>
                </div>
                <CategoryBadge cat={e.category} />
              </div>
            ))}
            {!upcoming.length && <Empty msg="No upcoming events." />}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Goal progress</CardTitle>
            <TargetIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {state.goals.slice(0, 3).map((g) => (
              <div key={g.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium truncate max-w-[180px]">{g.title}</span>
                  <span className="text-primary font-semibold">{g.progress}%</span>
                </div>
                <Progress value={g.progress} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border relative overflow-hidden gradient-brand text-white">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <CardHeader className="pb-3 relative"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="size-4" /> AI Suggestion</CardTitle></CardHeader>
          <CardContent className="relative space-y-3">
            <p className="text-sm opacity-95">You're ahead of schedule on <b>Learn Python</b>. Perfect day for a stretch task — try tackling async patterns tonight.</p>
            <Link to="/app/planner">
              <Button size="sm" variant="secondary" className="rounded-full bg-white text-primary hover:bg-white/90">Open AI Planner</Button>
            </Link>
            <p className="text-xs italic opacity-80 pt-2 border-t border-white/20">"{quote}"</p>
          </CardContent>
        </Card>
      </div>

      {/* Habits row */}
      <Card className="border">
        <CardHeader className="pb-3"><CardTitle className="text-base">Today's habits</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {state.habits.map((h) => {
            const today = new Date().toISOString().slice(0, 10);
            const done = h.log.includes(today);
            return (
              <div key={h.id} className="rounded-xl border p-3 flex items-center gap-3 hover:bg-muted/30">
                <div className="text-2xl">{h.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{h.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Flame className="size-3 text-warning" /> {h.streak}d streak
                  </div>
                </div>
                <div className={`size-4 rounded-full border-2 ${done ? "bg-success border-success" : "border-muted"}`} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: any; tone: "success" | "warning" }) {
  return (
    <div className="glass rounded-xl border px-3 py-2 flex items-center gap-2">
      <Icon className={`size-4 ${tone === "warning" ? "text-warning" : "text-success"}`} />
      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 py-2">
      <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
      <div className="font-bold text-sm">{value}</div>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="text-sm text-muted-foreground p-6 text-center">{msg}</div>;
}

const categoryStyles: Record<string, string> = {
  work: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  study: "bg-primary/15 text-primary border-primary/30",
  personal: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  health: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  meeting: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

export function CategoryBadge({ cat }: { cat: string }) {
  return <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 uppercase ${categoryStyles[cat] ?? ""}`}>{cat}</Badge>;
}

export function PriorityDot({ p }: { p: "low" | "medium" | "high" }) {
  const c = p === "high" ? "bg-destructive" : p === "medium" ? "bg-warning" : "bg-muted-foreground";
  return <span title={p} className={`size-2 rounded-full ${c}`} />;
}
