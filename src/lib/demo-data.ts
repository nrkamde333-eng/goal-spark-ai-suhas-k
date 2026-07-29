import { addDays, formatISO, startOfDay } from "date-fns";

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";
export type Category = "work" | "study" | "personal" | "health" | "meeting";

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  startTime?: string;
  endTime?: string;
  category: Category;
  goalId?: string;
  tags?: string[];
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate: string;
  category: Category;
  milestones: { id: string; title: string; done: boolean }[];
};

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  frequency: "daily" | "weekly";
  streak: number;
  bestStreak: number;
  log: string[]; // ISO dates completed
  color: string;
};

export type CalEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  category: Category;
  goalId?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  plan?: GeneratedPlan;
};

export type GeneratedPlan = {
  goalTitle: string;
  summary: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedHours: number;
  timeline: string;
  milestones: { title: string; week: number }[];
  weeklyTasks: string[];
  dailyTasks: string[];
  habits: { name: string; emoji: string }[];
  tips: string[];
};

export type AppState = {
  user: { name: string; email: string; avatar?: string } | null;
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  events: CalEvent[];
  messages: Message[];
  theme: "dark" | "light";
};

const today = startOfDay(new Date());
const iso = (d: Date) => formatISO(d);

export function makeDemoState(): AppState {
  const goals: Goal[] = [
    {
      id: "g1",
      title: "Learn Python in 3 months",
      description: "Master fundamentals, build 3 projects, prepare for coding interviews.",
      progress: 42,
      targetDate: iso(addDays(today, 75)),
      category: "study",
      milestones: [
        { id: "m1", title: "Complete syntax + data structures", done: true },
        { id: "m2", title: "Build CLI todo app", done: true },
        { id: "m3", title: "Learn Flask + build API", done: false },
        { id: "m4", title: "Deploy portfolio project", done: false },
      ],
    },
    {
      id: "g2",
      title: "Run a half-marathon",
      description: "Train 4x/week, gradual mileage increase, complete race.",
      progress: 28,
      targetDate: iso(addDays(today, 100)),
      category: "health",
      milestones: [
        { id: "m1", title: "Run 5k without stopping", done: true },
        { id: "m2", title: "Complete first 10k", done: false },
        { id: "m3", title: "Longest run: 15k", done: false },
        { id: "m4", title: "Race day", done: false },
      ],
    },
    {
      id: "g3",
      title: "Launch SaaS side project",
      description: "MVP, landing page, first 10 paying users.",
      progress: 15,
      targetDate: iso(addDays(today, 120)),
      category: "work",
      milestones: [
        { id: "m1", title: "Validate idea with 20 interviews", done: true },
        { id: "m2", title: "Build MVP", done: false },
        { id: "m3", title: "Launch on Product Hunt", done: false },
      ],
    },
  ];

  const tasks: Task[] = [
    { id: "t1", title: "Python: async/await deep dive", priority: "high", status: "todo", dueDate: iso(today), startTime: "09:00", endTime: "10:30", category: "study", goalId: "g1" },
    { id: "t2", title: "Team standup", priority: "medium", status: "todo", dueDate: iso(today), startTime: "10:30", endTime: "11:00", category: "meeting" },
    { id: "t3", title: "5k tempo run", priority: "high", status: "done", dueDate: iso(today), startTime: "07:00", endTime: "07:45", category: "health", goalId: "g2" },
    { id: "t4", title: "Design MVP landing hero", priority: "high", status: "in_progress", dueDate: iso(today), startTime: "14:00", endTime: "16:00", category: "work", goalId: "g3" },
    { id: "t5", title: "Read: Deep Work — ch. 4", priority: "low", status: "todo", dueDate: iso(today), startTime: "21:00", endTime: "21:45", category: "personal" },
    { id: "t6", title: "Flask tutorial: routing", priority: "high", status: "todo", dueDate: iso(addDays(today, 1)), category: "study", goalId: "g1" },
    { id: "t7", title: "Interview: user research call", priority: "medium", status: "todo", dueDate: iso(addDays(today, 1)), startTime: "11:00", endTime: "11:45", category: "meeting", goalId: "g3" },
    { id: "t8", title: "Long run — 8k", priority: "medium", status: "todo", dueDate: iso(addDays(today, 2)), category: "health", goalId: "g2" },
    { id: "t9", title: "Write blog post draft", priority: "low", status: "todo", dueDate: iso(addDays(today, 3)), category: "work" },
    { id: "t10", title: "Grocery shopping", priority: "low", status: "todo", dueDate: iso(addDays(today, -1)), category: "personal" },
  ];

  const habits: Habit[] = [
    { id: "h1", name: "Deep work 2h", emoji: "🎯", frequency: "daily", streak: 12, bestStreak: 18, color: "brand", log: seedLog(28, 0.85) },
    { id: "h2", name: "Morning run", emoji: "🏃", frequency: "daily", streak: 6, bestStreak: 21, color: "success", log: seedLog(28, 0.7) },
    { id: "h3", name: "Read 30 min", emoji: "📚", frequency: "daily", streak: 24, bestStreak: 24, color: "brand-2", log: seedLog(28, 0.9) },
    { id: "h4", name: "Meditate", emoji: "🧘", frequency: "daily", streak: 0, bestStreak: 9, color: "warning", log: seedLog(28, 0.4) },
    { id: "h5", name: "No sugar", emoji: "🥗", frequency: "daily", streak: 3, bestStreak: 14, color: "success", log: seedLog(28, 0.6) },
  ];

  const events: CalEvent[] = tasks
    .filter((t) => t.startTime && t.endTime)
    .map((t) => ({
      id: `e-${t.id}`,
      title: t.title,
      start: `${t.dueDate.slice(0, 10)}T${t.startTime}:00`,
      end: `${t.dueDate.slice(0, 10)}T${t.endTime}:00`,
      category: t.category,
      goalId: t.goalId,
    }));

  // Extra events on other days
  for (let i = 1; i < 14; i++) {
    const d = addDays(today, i);
    const day = iso(d).slice(0, 10);
    if (i % 2 === 0) events.push({ id: `e-run-${i}`, title: "Morning run", start: `${day}T07:00:00`, end: `${day}T07:45:00`, category: "health", goalId: "g2" });
    events.push({ id: `e-focus-${i}`, title: "Deep work: Python", start: `${day}T09:00:00`, end: `${day}T11:00:00`, category: "study", goalId: "g1" });
    if (i % 3 === 0) events.push({ id: `e-mvp-${i}`, title: "MVP build session", start: `${day}T14:00:00`, end: `${day}T16:00:00`, category: "work", goalId: "g3" });
  }

  return {
    user: { name: "Alex Rivera", email: "alex@goalpilot.ai" },
    tasks,
    goals,
    habits,
    events,
    messages: [],
    theme: "dark",
  };
}

function seedLog(days: number, density: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < days; i++) {
    if (Math.random() < density) out.push(iso(addDays(today, -i)).slice(0, 10));
  }
  return out;
}
