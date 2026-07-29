import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, parseISO, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/app/calendar")({
  head: () => ({ meta: [{ title: "Calendar — GoalPilot" }] }),
  component: CalendarPage,
});

const catColors: Record<string, string> = {
  work: "bg-blue-500/80",
  study: "bg-primary/80",
  personal: "bg-pink-500/80",
  health: "bg-emerald-500/80",
  meeting: "bg-amber-500/80",
};

function CalendarPage() {
  const { state, addEvent, deleteEvent } = useApp();
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", start: "09:00", end: "10:00", category: "work" as const });

  const monthStart = startOfMonth(cursor);
  const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(endOfMonth(cursor)) });

  const eventsFor = (d: Date) => state.events.filter((e) => isSameDay(parseISO(e.start), d));
  const selectedEvents = eventsFor(selected).sort((a, b) => a.start.localeCompare(b.start));

  const create = () => {
    if (!form.title.trim()) return;
    const day = format(selected, "yyyy-MM-dd");
    addEvent({
      title: form.title.trim(),
      start: `${day}T${form.start}:00`,
      end: `${day}T${form.end}:00`,
      category: form.category,
    });
    toast.success("Event added");
    setForm({ title: "", start: "09:00", end: "10:00", category: "work" });
    setOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">Drag your week around your goals.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setCursor(subMonths(cursor, 1))}><ChevronLeft className="size-4" /></Button>
          <div className="min-w-40 text-center font-semibold">{format(cursor, "MMMM yyyy")}</div>
          <Button size="icon" variant="outline" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="size-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => { setCursor(new Date()); setSelected(new Date()); }}>Today</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full gradient-brand text-white ml-2"><Plus className="size-4 mr-1" /> Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New event — {format(selected, "EEE MMM d")}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label className="text-xs">Title</Label><Input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Start</Label><Input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></div>
                  <div><Label className="text-xs">End</Label><Input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></div>
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
                <Button className="w-full rounded-full gradient-brand text-white" onClick={create}>Create event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <Card className="border overflow-hidden">
          <div className="grid grid-cols-7 border-b bg-muted/20">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="p-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-border">
            {days.map((d) => {
              const es = eventsFor(d);
              const inMonth = isSameMonth(d, cursor);
              const isSel = isSameDay(d, selected);
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setSelected(d)}
                  className={`bg-card min-h-24 p-2 text-left transition hover:bg-muted/30 ${!inMonth ? "opacity-40" : ""} ${isSel ? "ring-2 ring-primary ring-inset" : ""}`}
                >
                  <div className={`text-xs font-semibold mb-1 ${isToday(d) ? "text-primary" : ""}`}>
                    {isToday(d) ? <span className="inline-flex items-center justify-center size-6 rounded-full gradient-brand text-white">{format(d, "d")}</span> : format(d, "d")}
                  </div>
                  <div className="space-y-1">
                    {es.slice(0, 3).map((e) => (
                      <div key={e.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate text-white ${catColors[e.category] || "bg-muted"}`}>
                        {format(parseISO(e.start), "HH:mm")} {e.title}
                      </div>
                    ))}
                    {es.length > 3 && <div className="text-[10px] text-muted-foreground">+{es.length - 3} more</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="border p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">{format(selected, "EEEE")}</div>
          <div className="font-display font-extrabold text-2xl mb-4">{format(selected, "MMMM d")}</div>
          <div className="space-y-2">
            {selectedEvents.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">Nothing scheduled.</div>}
            {selectedEvents.map((e) => (
              <div key={e.id} className="group flex items-start gap-2 p-2 rounded-lg hover:bg-muted/40">
                <div className={`w-1 self-stretch rounded ${catColors[e.category]}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{e.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(parseISO(e.start), "HH:mm")} – {format(parseISO(e.end), "HH:mm")}
                  </div>
                </div>
                <button onClick={() => { deleteEvent(e.id); toast.success("Deleted"); }} className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-destructive">Delete</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
