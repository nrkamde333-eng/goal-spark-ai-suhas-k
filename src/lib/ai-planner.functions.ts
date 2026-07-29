import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ goal: z.string().min(3).max(500) });

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const system = `You are an expert productivity coach and goal planner. Given a user's goal, return a structured, motivating, actionable plan. Be specific and realistic. Respond ONLY with valid JSON matching this shape (no code fences, no prose):
{
  "goalTitle": string,
  "summary": string (2-3 sentences),
  "difficulty": "easy" | "medium" | "hard",
  "estimatedHours": number,
  "timeline": string (e.g. "12 weeks"),
  "milestones": [{ "title": string, "week": number }] (4-6 items),
  "weeklyTasks": string[] (5-7 items for the first week),
  "dailyTasks": string[] (4-6 items for today),
  "habits": [{ "name": string, "emoji": string }] (3-5 items),
  "tips": string[] (3-4 motivational + practical tips)
}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: data.goal },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
      throw new Error(`AI error: ${res.status} ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices: { message: { content: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
      throw new Error("AI returned unparseable response");
    }
  });

const ChatInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
});

export const chatAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          {
            role: "system",
            content:
              "You are GoalPilot, a warm, concise AI productivity coach inside a goal-planning app. Give practical, motivating suggestions. Use short paragraphs and bullets when helpful. Never longer than 200 words.",
          },
          ...data.messages,
        ],
      }),
    });
    if (!res.ok) {
      if (res.status === 429) throw new Error("Rate limit. Try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted.");
      throw new Error(`AI error: ${res.status}`);
    }
    const json = (await res.json()) as { choices: { message: { content: string } }[] };
    return { content: json.choices?.[0]?.message?.content ?? "" };
  });
