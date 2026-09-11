import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Plus, Sparkles, Trash2, X } from "lucide-react";
import { useState } from "react";

import { OutputPanel } from "@/components/OutputPanel";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePlan, type Priority, type PlannerTask } from "@/lib/ai";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workly AI" },
      {
        name: "description",
        content:
          "Enter tasks, deadlines, priorities and available hours to generate a practical daily or weekly work schedule with time blocks.",
      },
      { property: "og:title", content: "AI Task Planner — Workly AI" },
      {
        property: "og:description",
        content: "Organize and prioritize your daily or weekly workload.",
      },
    ],
  }),
  component: PlannerTool,
});

const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

function newTask(): PlannerTask {
  return {
    id: Math.random().toString(36).slice(2),
    name: "",
    deadline: "",
    priority: "Medium",
    duration: 1,
  };
}

function PlannerTool() {
  const [tasks, setTasks] = useState<PlannerTask[]>([newTask()]);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [startHour, setStartHour] = useState(9);
  const [mode, setMode] = useState<"Daily" | "Weekly">("Daily");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(id: string, patch: Partial<PlannerTask>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  const named = tasks.filter((t) => t.name.trim() !== "");

  async function run() {
    if (named.length === 0) {
      setError("Add at least one task with a name before generating a plan.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setOutput(await generatePlan({ tasks: named, hoursPerDay, startHour, mode }));
    } catch {
      setError("Something went wrong while building the plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        icon={CalendarClock}
        title="AI Task Planner"
        description="Organize and prioritize your daily or weekly workload. Add your tasks, then generate a schedule with suggested time blocks."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="mode">Plan type</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as "Daily" | "Weekly")}>
                <SelectTrigger id="mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily Plan</SelectItem>
                  <SelectItem value="Weekly">Weekly Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Working hours / day</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                max={16}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start">Day starts at</Label>
              <Input
                id="start"
                type="number"
                min={0}
                max={22}
                value={startHour}
                onChange={(e) => setStartHour(Math.min(22, Math.max(0, Number(e.target.value) || 0)))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tasks</Label>
            {tasks.map((task, i) => (
              <div key={task.id} className="rounded-xl border border-border bg-background/40 p-3">
                <div className="flex items-center gap-2">
                  <Input
                    aria-label={`Task ${i + 1} name`}
                    placeholder="Task name"
                    value={task.name}
                    onChange={(e) => update(task.id, { name: e.target.value })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove task"
                    disabled={tasks.length === 1}
                    onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <Input
                    type="date"
                    aria-label={`Task ${i + 1} deadline`}
                    value={task.deadline}
                    onChange={(e) => update(task.id, { deadline: e.target.value })}
                  />
                  <Select
                    value={task.priority}
                    onValueChange={(v) => update(task.id, { priority: v as Priority })}
                  >
                    <SelectTrigger aria-label={`Task ${i + 1} priority`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p} priority
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0.25}
                    step={0.25}
                    aria-label={`Task ${i + 1} estimated hours`}
                    value={task.duration}
                    onChange={(e) =>
                      update(task.id, { duration: Math.max(0.25, Number(e.target.value) || 0.25) })
                    }
                  />
                </div>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setTasks((prev) => [...prev, newTask()])}>
              <Plus className="size-4" />
              Add task
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="hero" onClick={run} disabled={loading}>
              <Sparkles className="size-4" />
              {loading ? "Planning…" : "Generate Plan"}
            </Button>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => {
                setTasks([newTask()]);
                setOutput("");
                setError(null);
              }}
            >
              <Trash2 className="size-4" />
              Clear
            </Button>
          </div>
        </section>

        <OutputPanel
          title="Your schedule"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={named.length ? run : undefined}
          emptyHint="Tasks will be grouped by priority with suggested time blocks and an order of work."
          note="AI schedules are recommendations only — adjust them when priorities, meetings or circumstances change."
        />
      </div>
    </div>
  );
}
