import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, Flame, Target as TargetIcon, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — GoalPilot" },
      { name: "description", content: "Visualize productivity, task completion, habit streaks and goal progress." },
      { property: "og:title", content: "Analytics — GoalPilot" },
      { property: "og:description", content: "Insights and trends for your goals, tasks and habits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { state } = useApp();
  const done = state.tasks.filter((t) => t.status === "done").length;
  const total = state.tasks.length;
  const rate = total ? Math.round((done / total) * 100) : 0;
  const streak = Math.max(0, ...state.habits.map((h) => h.streak));
  const goalsDone = state.goals.filter((g) => g.progress >= 100).length;
  const focusHours = 18.5;

  const weekly = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
    day: d,
    tasks: 4 + Math.round(Math.sin(i) * 3 + 3),
    hours: 2 + Math.round(Math.cos(i) * 1.5 + 2),
  }));

  const categoryData = ["work", "study", "personal", "health", "meeting"].map((c) => ({
    name: c,
    value: state.tasks.filter((t) => t.category === c).length,
  })).filter((x) => x.value > 0);
  const colors = ["oklch(0.68 0.19 285)", "oklch(0.72 0.17 155)", "oklch(0.78 0.15 200)", "oklch(0.80 0.16 80)", "oklch(0.70 0.20 20)"];

  const monthly = Array.from({ length: 12 }, (_, i) => ({
    m: ["J","F","M","A","M","J","J","A","S","O","N","D"][i],
    score: 40 + Math.round(Math.sin(i / 2) * 20 + i * 3),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="font-display font-extrabold text-2xl tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Your progress at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={CheckCircle2} label="Tasks done" value={String(done)} sub={`of ${total}`} tone="success" />
        <Kpi icon={Flame} label="Current streak" value={`${streak}d`} sub="keep going" tone="warning" />
        <Kpi icon={TargetIcon} label="Goals complete" value={String(goalsDone)} sub={`of ${state.goals.length}`} tone="brand" />
        <Kpi icon={TrendingUp} label="Focus hours" value={`${focusHours}h`} sub="this week" tone="brand-2" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="border lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Weekly activity</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="tasks" radius={[6, 6, 0, 0]} fill="oklch(0.68 0.19 285)" />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]} fill="oklch(0.72 0.17 155)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Category split</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {categoryData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border">
        <CardHeader className="pb-2"><CardTitle className="text-base">Productivity trend</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Line dataKey="score" type="monotone" stroke="oklch(0.68 0.19 285)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader className="pb-2"><CardTitle className="text-base">Goal progress</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {state.goals.map((g) => (
            <div key={g.id}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{g.title}</span>
                <span className="text-primary font-semibold">{g.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-brand" style={{ width: `${g.progress}%` }} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {g.milestones.filter((m) => m.done).length}/{g.milestones.length} milestones · target {new Date(g.targetDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub, tone }: { icon: any; label: string; value: string; sub: string; tone: "brand" | "brand-2" | "success" | "warning" }) {
  const toneClass = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "brand-2" ? "text-brand-2" : "text-primary";
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          <Icon className={`size-4 ${toneClass}`} /> {label}
        </div>
        <div className="mt-2 font-display font-extrabold text-3xl">{value}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}
