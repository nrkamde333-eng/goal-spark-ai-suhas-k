import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle2, Circle, Plus, Trash2, Clock, Pin } from "lucide-react";
import { format, isToday, isTomorrow, isThisWeek, isPast, parseISO } from "date-fns";
import { CategoryBadge, PriorityDot } from "./app.index";
import { toast } from "sonner";

export const Route = createFileRoute("/app/tasks")({
  head: () => ({ meta: [{ title: "Tasks — GoalPilot" }] }),
  component: TasksPage,
});

const filters = [
  { id: "today", label: "Today", fn: (t: any) => isToday(parseISO(t.dueDate)) },
  { id: "tomorrow", label: "Tomorrow", fn: (t: any) => isTomorrow(parseISO(t.dueDate)) },
  { id: "week", label: "This week", fn: (t: any) => isThisWeek(parseISO(t.dueDate), { weekStartsOn: 1 }) },
  { id: "overdue", label: "Overdue", fn: (t: any) => isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate)) && t.status !== "done" },
  { id: "high", label: "High", fn: (t: any) => t.priority === "high" && t.status !== "done" },
  { id: "done", label: "Completed", fn: (t: any) => t.status === "done" },
  { id: "all", label: "All", fn: () => true },
];

function TasksPage() {
  const { state, toggleTask, deleteTask, addTask } = useApp();
  const [filter, setFilter] = useState("today");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium" as const, category: "work" as const,
    date: format(new Date(), "yyyy-MM-dd"), start: "", end: "",
  });

  const f = filters.find((x) => x.id === filter)!;
  const items = state.tasks.filter(f.fn);
  const grouped = groupBy(items, (t) => t.dueDate.slice(0, 10));

  const create = () => {
    if (!form.title.trim()) return;
    addTask({
      title: form.title.trim(),
      description: form.description,
      priority: form.priority,
      status: "todo",
      category: form.category,
      dueDate: new Date(`${form.date}T00:00:00`).toISOString(),
      startTime: form.start || undefined,
      endTime: form.end || undefined,
    });
    toast.success("Task created");
    setForm({ title: "", description: "", priority: "medium", category: "work", date: format(new Date(), "yyyy-MM-dd"), start: "", end: "" });
    setOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">Everything you're working on.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full gradient-brand text-white"><Plus className="size-4 mr-1" /> New task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New task</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label className="text-xs">Title</Label><Input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Ship the landing page" /></div>
              <div><Label className="text-xs">Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Priority</Label>
                  <Select value={form.priority} onValueChange={(v: any) => setForm({ ...form, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["low", "medium", "high"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Category</Label>
                  <Select value={form.category} onValueChange={(v: any) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["work", "study", "personal", "health", "meeting"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label className="text-xs">Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                <div><Label className="text-xs">Start</Label><Input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></div>
                <div><Label className="text-xs">End</Label><Input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></div>
              </div>
              <Button className="w-full rounded-full gradient-brand text-white" onClick={create}>Create task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="flex flex-wrap h-auto bg-transparent p-0 gap-1">
          {filters.map((f) => (
            <TabsTrigger key={f.id} value={f.id} className="rounded-full border bg-card data-[state=active]:gradient-brand data-[state=active]:text-white">
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-6">
        {Object.entries(grouped).sort().map(([day, list]) => (
          <div key={day}>
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">
              {isToday(parseISO(day)) ? "Today" : isTomorrow(parseISO(day)) ? "Tomorrow" : format(parseISO(day), "EEE, MMM d")}
              <span className="ml-2 text-muted-foreground">· {list.length}</span>
            </div>
            <Card className="border divide-y">
              {list.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 transition group">
                  <button onClick={() => toggleTask(t.id)} className="shrink-0">
                    {t.status === "done"
                      ? <CheckCircle2 className="size-5 text-success" />
                      : <Circle className="size-5 text-muted-foreground hover:text-primary" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}>{t.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      {t.startTime && <span className="flex items-center gap-1"><Clock className="size-3" />{t.startTime}</span>}
                      <CategoryBadge cat={t.category} />
                    </div>
                  </div>
                  <PriorityDot p={t.priority} />
                  <button onClick={() => { deleteTask(t.id); toast.success("Deleted"); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </Card>
          </div>
        ))}
        {items.length === 0 && (
          <Card className="border p-12 text-center text-muted-foreground">
            <Pin className="size-10 mx-auto mb-3 opacity-30" />
            Nothing here. Enjoy the empty inbox.
          </Card>
        )}
      </div>
    </div>
  );
}

function groupBy<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {});
}
