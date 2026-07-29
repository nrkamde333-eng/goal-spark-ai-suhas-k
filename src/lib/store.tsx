import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { makeDemoState, type AppState, type Task, type Habit, type CalEvent, type Message, type Goal } from "./demo-data";

const KEY = "goalpilot-state-v1";

type Ctx = {
  state: AppState;
  setState: (updater: (s: AppState) => AppState) => void;
  // Actions
  toggleTask: (id: string) => void;
  addTask: (t: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  logHabit: (id: string, date: string) => void;
  addHabit: (h: Omit<Habit, "id" | "log" | "streak" | "bestStreak">) => void;
  deleteHabit: (id: string) => void;
  addEvent: (e: Omit<CalEvent, "id">) => void;
  deleteEvent: (id: string) => void;
  addMessage: (m: Omit<Message, "id" | "createdAt">) => Message;
  addGoal: (g: Omit<Goal, "id">) => Goal;
  resetDemo: () => void;
  toggleTheme: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

function loadState(): AppState {
  if (typeof window === "undefined") return makeDemoState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const demo = makeDemoState();
      localStorage.setItem(KEY, JSON.stringify(demo));
      return demo;
    }
    return JSON.parse(raw) as AppState;
  } catch {
    return makeDemoState();
  }
}

const EMPTY_STATE: AppState = {
  user: { name: "Alex Rivera", email: "alex@goalpilot.ai" },
  tasks: [], goals: [], habits: [], events: [], messages: [], theme: "dark",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, _setState] = useState<AppState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    _setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
    if (state.theme === "light") document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
  }, [state, hydrated]);

  const setState = (updater: (s: AppState) => AppState) => _setState((prev) => updater(prev));

  const uid = () => Math.random().toString(36).slice(2, 10);

  const ctx: Ctx = {
    state,
    setState,
    toggleTask: (id) =>
      setState((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t,
        ),
      })),
    addTask: (t) => setState((s) => ({ ...s, tasks: [{ ...t, id: uid() }, ...s.tasks] })),
    deleteTask: (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
    updateTask: (id, patch) =>
      setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
    logHabit: (id, date) =>
      setState((s) => ({
        ...s,
        habits: s.habits.map((h) => {
          if (h.id !== id) return h;
          const has = h.log.includes(date);
          const log = has ? h.log.filter((d) => d !== date) : [...h.log, date];
          const streak = computeStreak(log);
          return { ...h, log, streak, bestStreak: Math.max(h.bestStreak, streak) };
        }),
      })),
    addHabit: (h) =>
      setState((s) => ({
        ...s,
        habits: [{ ...h, id: uid(), log: [], streak: 0, bestStreak: 0 }, ...s.habits],
      })),
    deleteHabit: (id) => setState((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) })),
    addEvent: (e) => setState((s) => ({ ...s, events: [{ ...e, id: uid() }, ...s.events] })),
    deleteEvent: (id) => setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) })),
    addMessage: (m) => {
      const msg: Message = { ...m, id: uid(), createdAt: new Date().toISOString() };
      setState((s) => ({ ...s, messages: [...s.messages, msg] }));
      return msg;
    },
    addGoal: (g) => {
      const goal: Goal = { ...g, id: uid() };
      setState((s) => ({ ...s, goals: [goal, ...s.goals] }));
      return goal;
    },
    resetDemo: () => {
      const demo = makeDemoState();
      _setState(demo);
    },
    toggleTheme: () =>
      setState((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" })),
  };

  return <AppCtx.Provider value={ctx}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp outside provider");
  return v;
}

function computeStreak(log: string[]): number {
  const set = new Set(log);
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      // Allow today to be uncompleted
      if (streak === 0) {
        d.setDate(d.getDate() - 1);
        const key2 = d.toISOString().slice(0, 10);
        if (set.has(key2)) {
          streak++;
          d.setDate(d.getDate() - 1);
          continue;
        }
      }
      break;
    }
  }
  return streak;
}
