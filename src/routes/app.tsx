import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Brain, Calendar, ListChecks, Target, LineChart, Settings,
  Search, Bell, Moon, Sun, Sparkles, Plus, LogOut, User, Menu, X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Workspace — GoalPilot" },
      { name: "description", content: "Your AI-powered productivity workspace." },
    ],
  }),
  component: AppLayout,
});

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/planner", label: "AI Planner", icon: Brain },
  { to: "/app/calendar", label: "Calendar", icon: Calendar },
  { to: "/app/tasks", label: "Tasks", icon: ListChecks },
  { to: "/app/habits", label: "Habits", icon: Target },
  { to: "/app/analytics", label: "Analytics", icon: LineChart },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function AppLayout() {
  const { state, toggleTheme, addTask, resetDemo } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string, end?: boolean) =>
    end ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {nav.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={onNavigate}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
            isActive(n.to, n.end)
              ? "bg-primary/15 text-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          }`}
        >
          <n.icon className="size-4" />
          {n.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
        <Link to="/" className="flex items-center gap-2.5 px-5 h-16 border-b">
          <div className="size-8 rounded-lg gradient-brand grid place-items-center shadow-lg shadow-primary/30">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight">GoalPilot</span>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          <NavItems />
        </nav>
        <div className="p-3 border-t">
          <div className="rounded-xl p-3 glass border">
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-2">Active goals</div>
            <div className="space-y-2">
              {state.goals.slice(0, 3).map((g) => (
                <div key={g.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="truncate max-w-[140px]">{g.title}</span>
                    <span className="text-primary font-semibold">{g.progress}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full gradient-brand" style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 px-2 py-2">
            <div className="size-8 rounded-full gradient-brand grid place-items-center font-bold text-white text-xs">
              {state.user?.name.split(" ").map((s) => s[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{state.user?.name}</div>
              <div className="text-xs text-muted-foreground truncate">{state.user?.email}</div>
            </div>
            <button
              onClick={() => { toast.success("Signed out"); navigate({ to: "/" }); }}
              className="p-1.5 text-muted-foreground hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 h-16 border-b glass flex items-center justify-between px-4 md:px-6 gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="md:hidden shrink-0" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-sidebar text-sidebar-foreground p-0 border-r flex flex-col">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex items-center justify-between px-5 h-16 border-b">
                  <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg gradient-brand grid place-items-center shadow-lg shadow-primary/30">
                      <Sparkles className="size-4 text-white" />
                    </div>
                    <span className="font-display font-extrabold text-lg tracking-tight">GoalPilot</span>
                  </Link>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                  <NavItems onNavigate={() => setMobileOpen(false)} />
                </nav>
                <div className="p-3 border-t">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full gradient-brand grid place-items-center font-bold text-white text-xs">
                      {state.user?.name.split(" ").map((s) => s[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{state.user?.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{state.user?.email}</div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="relative w-full max-w-lg hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search tasks, habits, goals…" className="pl-9 rounded-full bg-muted/40 border-transparent" />
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full gradient-brand text-white hidden sm:inline-flex">
                  <Plus className="size-4 mr-1" /> Quick add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New task</DialogTitle></DialogHeader>
                <Input autoFocus placeholder="What do you want to get done?" value={quickTitle} onChange={(e) => setQuickTitle(e.target.value)} onKeyDown={(e) => {
                  if (e.key === "Enter" && quickTitle.trim()) {
                    addTask({ title: quickTitle.trim(), priority: "medium", status: "todo", dueDate: new Date().toISOString(), category: "personal" });
                    setQuickTitle(""); setQuickOpen(false); toast.success("Task added");
                  }
                }} />
                <Button className="rounded-full gradient-brand text-white" onClick={() => {
                  if (!quickTitle.trim()) return;
                  addTask({ title: quickTitle.trim(), priority: "medium", status: "todo", dueDate: new Date().toISOString(), category: "personal" });
                  setQuickTitle(""); setQuickOpen(false); toast.success("Task added");
                }}>Add task</Button>
              </DialogContent>
            </Dialog>
            <Button size="icon" variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
              {state.theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button size="icon" variant="ghost" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => { resetDemo(); toast.success("Demo data reset"); }} aria-label="Reset demo">
              <User className="size-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
