import { addDaysKey, dayKey, localStamp, todayKey } from "./date-utils";

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";
export type Category = "work" | "study" | "personal" | "health" | "meeting";

export const CATEGORIES: Category[] = ["work", "study", "personal", "health", "meeting"];
export const PRIORITIES: Priority[] = ["low", "medium", "high"];

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  /** Local day key: "yyyy-MM-dd". */
  dueDate: string;
  startTime?: string;
  endTime?: string;
  estimatedMinutes?: number;
  category: Category;
  goalId?: string;
  planId?: string;
  tags?: string[];
  completedAt?: string;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate: string;
  category: Category;
  planId?: string;
  milestones: { id: string; title: string; done: boolean }[];
};

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  frequency: "daily" | "weekly";
  streak: number;
  bestStreak: number;
  /** Local day keys the habit was completed. */
  log: string[];
  color: string;
  createdAt: string;
};

export type CalEvent = {
  id: string;
  title: string;
  /** Local stamp: "yyyy-MM-ddTHH:mm:00". */
  start: string;
  end: string;
  category: Category;
  goalId?: string;
  /** Set when this event mirrors a task, so the two stay in sync. */
  taskId?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  plan?: GeneratedPlan;
  /** Stable id for the plan so it can only be applied once. */
  planId?: string;
};

export type GeneratedPlan = {
  goalTitle: string;
  summary: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedHours: number;
  timeline: string;
  category: Category;
  milestones: { title: string; week: number }[];
  weeklyTasks: string[];
  dailyTasks: string[];
  habits: { name: string; emoji: string }[];
  tips: string[];
};

export type Settings = {
  dailyCapacityHours: number;
  aiSuggestions: boolean;
  reminders: boolean;
  weekStartsMonday: boolean;
};

export type AppState = {
  schemaVersion: number;
  user: { name: string; email: string; avatar?: string } | null;
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  events: CalEvent[];
  messages: Message[];
  appliedPlanIds: string[];
  dismissedAlerts: string[];
  settings: Settings;
  theme: "dark" | "light";
};

export const SCHEMA_VERSION = 2;

export const DEFAULT_SETTINGS: Settings = {
  dailyCapacityHours: 6,
  aiSuggestions: true,
  reminders: true,
  weekStartsMonday: true,
};

export function emptyState(): AppState {
  return {
    schemaVersion: SCHEMA_VERSION,
    user: { name: "Alex Rivera", email: "alex@goalpilot.ai" },
    tasks: [],
    goals: [],
    habits: [],
    events: [],
    messages: [],
    appliedPlanIds: [],
    dismissedAlerts: [],
    settings: { ...DEFAULT_SETTINGS },
    theme: "dark",
  };
}

export function makeDemoState(): AppState {
  const T = todayKey();
  const d = (n: number) => addDaysKey(T, n);

  const goals: Goal[] = [
    {
      id: "g1",
      title: "Learn Python in 3 months",
      description: "Master fundamentals, build 3 projects, prepare for coding interviews.",
      progress: 42,
      targetDate: d(75),
      category: "study",
      milestones: [
        { id: "g1-m1", title: "Complete syntax + data structures", done: true },
        { id: "g1-m2", title: "Build CLI todo app", done: true },
        { id: "g1-m3", title: "Learn Flask + build API", done: false },
        { id: "g1-m4", title: "Deploy portfolio project", done: false },
      ],
    },
    {
      id: "g2",
      title: "Run a half-marathon",
      description: "Train 4x/week, gradual mileage increase, complete race.",
      progress: 28,
      targetDate: d(100),
      category: "health",
      milestones: [
        { id: "g2-m1", title: "Run 5k without stopping", done: true },
        { id: "g2-m2", title: "Complete first 10k", done: false },
        { id: "g2-m3", title: "Longest run: 15k", done: false },
        { id: "g2-m4", title: "Race day", done: false },
      ],
    },
    {
      id: "g3",
      title: "Launch SaaS side project",
      description: "MVP, landing page, first 10 paying users.",
      progress: 15,
      targetDate: d(120),
      category: "work",
      milestones: [
        { id: "g3-m1", title: "Validate idea with 20 interviews", done: true },
        { id: "g3-m2", title: "Build MVP", done: false },
        { id: "g3-m3", title: "Launch on Product Hunt", done: false },
      ],
    },
  ];

  const tasks: Task[] = [
    { id: "t1", title: "Python: async/await deep dive", priority: "high", status: "todo", dueDate: T, startTime: "09:00", endTime: "10:30", estimatedMinutes: 90, category: "study", goalId: "g1" },
    { id: "t2", title: "Team standup", priority: "medium", status: "todo", dueDate: T, startTime: "10:30", endTime: "11:00", estimatedMinutes: 30, category: "meeting" },
    { id: "t3", title: "5k tempo run", priority: "high", status: "done", dueDate: T, startTime: "07:00", endTime: "07:45", estimatedMinutes: 45, category: "health", goalId: "g2", completedAt: `${T}T07:45:00` },
    { id: "t4", title: "Design MVP landing hero", priority: "high", status: "in_progress", dueDate: T, startTime: "14:00", endTime: "16:00", estimatedMinutes: 120, category: "work", goalId: "g3" },
    { id: "t5", title: "Read: Deep Work — ch. 4", priority: "low", status: "todo", dueDate: T, startTime: "21:00", endTime: "21:45", estimatedMinutes: 45, category: "personal" },
    { id: "t6", title: "Flask tutorial: routing", priority: "high", status: "todo", dueDate: d(1), estimatedMinutes: 60, category: "study", goalId: "g1" },
    { id: "t7", title: "Interview: user research call", priority: "medium", status: "todo", dueDate: d(1), startTime: "11:00", endTime: "11:45", estimatedMinutes: 45, category: "meeting", goalId: "g3" },
    { id: "t8", title: "Long run — 8k", priority: "medium", status: "todo", dueDate: d(2), estimatedMinutes: 75, category: "health", goalId: "g2" },
    { id: "t9", title: "Write blog post draft", priority: "low", status: "todo", dueDate: d(3), estimatedMinutes: 60, category: "work" },
    { id: "t10", title: "Grocery shopping", priority: "low", status: "todo", dueDate: d(-1), estimatedMinutes: 45, category: "personal" },
  ];

  // Past week of completed work so analytics has real history to chart.
  const history: Array<[number, string, Category, number, string | undefined]> = [
    [-1, "Python: list comprehensions", "study", 60, "g1"],
    [-1, "Sprint planning", "meeting", 45, undefined],
    [-2, "Easy run — 4k", "health", 40, "g2"],
    [-2, "Wireframe onboarding", "work", 90, "g3"],
    [-3, "Python: file I/O exercises", "study", 75, "g1"],
    [-3, "Read: Deep Work — ch. 3", "personal", 45, undefined],
    [-4, "Interval training", "health", 50, "g2"],
    [-4, "Competitor research", "work", 60, "g3"],
    [-5, "Python: dictionaries drill", "study", 60, "g1"],
    [-6, "Rest-day mobility", "health", 25, "g2"],
    [-6, "Weekly review", "personal", 30, undefined],
  ];
  history.forEach(([offset, title, category, minutes, goalId], i) => {
    const key = d(offset);
    tasks.push({
      id: `h${i}`,
      title,
      priority: i % 3 === 0 ? "high" : "medium",
      status: "done",
      dueDate: key,
      estimatedMinutes: minutes,
      category,
      goalId,
      completedAt: `${key}T18:00:00`,
    });
  });

  const habits: Habit[] = [
    { id: "hb1", name: "Deep work 2h", emoji: "🎯", frequency: "daily", color: "brand", log: seedLog(T, 56, 0.85, 1), streak: 0, bestStreak: 0, createdAt: d(-56) },
    { id: "hb2", name: "Morning run", emoji: "🏃", frequency: "daily", color: "success", log: seedLog(T, 56, 0.7, 2), streak: 0, bestStreak: 0, createdAt: d(-56) },
    { id: "hb3", name: "Read 30 min", emoji: "📚", frequency: "daily", color: "brand-2", log: seedLog(T, 56, 0.9, 3), streak: 0, bestStreak: 0, createdAt: d(-56) },
    { id: "hb4", name: "Meditate", emoji: "🧘", frequency: "daily", color: "warning", log: seedLog(T, 56, 0.45, 4), streak: 0, bestStreak: 0, createdAt: d(-56) },
    { id: "hb5", name: "No sugar", emoji: "🥗", frequency: "daily", color: "success", log: seedLog(T, 56, 0.6, 5), streak: 0, bestStreak: 0, createdAt: d(-56) },
  ];

  // Events mirror timed tasks so the calendar always matches the task list.
  const events: CalEvent[] = tasks
    .filter((t) => t.startTime && t.endTime && t.status !== "done")
    .map((t) => ({
      id: `e-${t.id}`,
      title: t.title,
      start: localStamp(t.dueDate, t.startTime!),
      end: localStamp(t.dueDate, t.endTime!),
      category: t.category,
      goalId: t.goalId,
      taskId: t.id,
    }));

  for (let i = 1; i < 14; i++) {
    const key = d(i);
    if (i % 2 === 0) events.push({ id: `e-run-${i}`, title: "Morning run", start: localStamp(key, "07:00"), end: localStamp(key, "07:45"), category: "health", goalId: "g2" });
    if (i % 3 === 0) events.push({ id: `e-mvp-${i}`, title: "MVP build session", start: localStamp(key, "14:00"), end: localStamp(key, "16:00"), category: "work", goalId: "g3" });
  }

  const state: AppState = {
    ...emptyState(),
    tasks,
    goals,
    habits,
    events,
  };
  return state;
}

/** Deterministic seed so SSR and client hydration produce identical logs. */
function seedLog(fromKey: string, days: number, density: number, salt: number): string[] {
  const out: string[] = [];
  for (let i = 1; i <= days; i++) {
    const pseudo = (((i * 9301 + salt * 49297) % 233280) / 233280 + salt * 0.13) % 1;
    if (pseudo < density) out.push(addDaysKey(fromKey, -i));
  }
  return out;
}

export { dayKey };
