import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — GoalPilot" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, resetDemo, toggleTheme } = useApp();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="font-display font-extrabold text-2xl tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Personalize your workspace.</p>
      </div>

      <Card className="border">
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full gradient-brand grid place-items-center text-white font-bold text-xl">
              {state.user?.name.split(" ").map((s) => s[0]).join("")}
            </div>
            <div>
              <div className="font-semibold">{state.user?.name}</div>
              <div className="text-sm text-muted-foreground">{state.user?.email}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Name</Label><Input defaultValue={state.user?.name} /></div>
            <div><Label className="text-xs">Email</Label><Input defaultValue={state.user?.email} /></div>
            <div><Label className="text-xs">Timezone</Label><Input defaultValue="UTC+00:00" /></div>
            <div><Label className="text-xs">Language</Label><Input defaultValue="English" /></div>
          </div>
          <Button className="rounded-full gradient-brand text-white" onClick={() => toast.success("Profile saved")}>Save changes</Button>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader><CardTitle className="text-base">Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Row label="Dark mode" desc="Toggle between light and dark themes">
            <Switch checked={state.theme === "dark"} onCheckedChange={toggleTheme} />
          </Row>
          <Separator />
          <Row label="Browser notifications" desc="Reminders for tasks and habits"><Switch defaultChecked /></Row>
          <Separator />
          <Row label="Email digest" desc="Weekly summary every Monday"><Switch /></Row>
          <Separator />
          <Row label="AI suggestions" desc="Proactive tips in your dashboard"><Switch defaultChecked /></Row>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader><CardTitle className="text-base">Data</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => toast.success("Exported")}>Export data</Button>
          <Button variant="outline" className="rounded-full" onClick={() => { resetDemo(); toast.success("Demo reset"); }}>Reset demo data</Button>
          <Button variant="outline" className="rounded-full text-destructive hover:text-destructive" onClick={() => toast.warning("Coming soon")}>Delete account</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      {children}
    </div>
  );
}
